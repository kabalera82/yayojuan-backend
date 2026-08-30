const Order = require('../models/order.model');
const Product = require('../models/product.model');
const sendTelegramMessage = require('../config/telegram');

// Crea un pedido con el carrito que envía el cliente y avisa por Telegram
const requestOrder = async (req, res) => {
  try {
    const {items} = req.body;

    if (!Array.isArray(items) || !items.length) {
      return res.status(400).json({message: 'El carrito está vacío'});
    }

    const address = req.user.addresses.find((entry) => entry.isDefault) || req.user.addresses[0];

    if (!address) {
      return res
        .status(400)
        .json({message: 'Añade una dirección de envío antes de solicitar el pedido'});
    }

    // Nombres y precios se leen de la base de datos, nunca de lo que manda el cliente
    const products = await Product.find({_id: {$in: items.map((item) => item.product)}});

    if (products.length !== items.length) {
      return res.status(400).json({message: 'Algún producto del carrito ya no está disponible'});
    }

    const orderItems = [];

    for (const item of items) {
      const product = products.find((entry) => entry._id.equals(item.product));

      // El stock del carrito puede estar obsoleto o manipulado: manda el de la base de datos
      if (item.quantity > product.stock) {
        return res.status(400).json({message: `No hay stock suficiente de ${product.name}`});
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price
      });
    }

    const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress: {
        street: address.street,
        city: address.city,
        postalCode: address.postalCode,
        country: address.country
      },
      totalPrice
    });

    const lines = orderItems.map(
      (item) => `- ${item.name} x${item.quantity} — ${(item.price * item.quantity).toFixed(2)} €`
    );

    await sendTelegramMessage(
      'Nuevo pedido solicitado\n' +
        `Cliente: ${req.user.username} ${req.user.userSurname}\n` +
        `Email: ${req.user.email}\n` +
        `Teléfono: ${req.user.phone}\n` +
        `Envío: ${address.street}, ${address.postalCode} ${address.city} (${address.country})\n\n` +
        `${lines.join('\n')}\n\n` +
        `Total: ${totalPrice.toFixed(2)} €`
    );

    return res.status(200).json(order);
  } catch {
    return res.status(400).json({message: 'No se pudo solicitar el pedido'});
  }
};

// Pedidos del usuario autenticado, ordenables por estado o fecha (asc/desc)
const getMyOrders = async (req, res) => {
  try {
    const {sort} = req.query;

    // Iniciamos la consulta a la base de datos con el filtro del usuario autenticado
    let query = Order.find({user: req.user._id});

    // Aplicamos el ordenamiento solicitado si se proporcionó en el query
    if (sort === 'date_asc') query = query.sort({createdAt: 1});
    if (sort === 'date_desc') query = query.sort({createdAt: -1});
    if (sort === 'status_asc') query = query.sort({status: 1});
    if (sort === 'status_desc') query = query.sort({status: -1});

    const orders = await query;
    return res.status(200).json(orders);
  } catch {
    return res.status(400).json({message: 'No se pudieron obtener los pedidos'});
  }
};

// Todos los pedidos (admin), ordenables por estado o fecha (asc/desc)
const getOrders = async (req, res) => {
  try {
    const {sort} = req.query;

    // Iniciamos la consulta a la base de datos
    let query = Order.find().populate('user', 'username email');

    // Aplicamos el ordenamiento solicitado si se proporcionó en el query
    if (sort === 'date_asc') query = query.sort({createdAt: 1});
    if (sort === 'date_desc') query = query.sort({createdAt: -1});
    if (sort === 'status_asc') query = query.sort({status: 1});
    if (sort === 'status_desc') query = query.sort({status: -1});

    const orders = await query;
    return res.status(200).json(orders);
  } catch {
    return res.status(400).json({message: 'No se pudieron obtener los pedidos'});
  }
};

// Detalle de un pedido: su dueño o un admin
const getOrderById = async (req, res) => {
  try {
    const {id} = req.params;
    const order = await Order.findById(id).populate('user', 'username email');

    if (!order) {
      return res.status(400).json({message: 'Pedido no encontrado'});
    }

    const isOwner = order.user._id.equals(req.user._id);
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(400).json({message: 'No tienes permisos para ver este pedido'});
    }

    return res.status(200).json(order);
  } catch {
    return res.status(400).json({message: 'No se pudo obtener el pedido'});
  }
};

// Cambia el estado de un pedido (admin)
const updateOrderStatus = async (req, res) => {
  try {
    const {id} = req.params;
    const {status} = req.body;

    const validStatuses = Order.schema.path('status').enumValues;
    if (!validStatuses.includes(status)) {
      return res.status(400).json({message: 'Estado no válido'});
    }

    const order = await Order.findByIdAndUpdate(id, {status}, {new: true, runValidators: true});

    if (!order) {
      return res.status(400).json({message: 'Pedido no encontrado'});
    }

    return res.status(200).json(order);
  } catch {
    return res.status(400).json({message: 'No se pudo actualizar el pedido'});
  }
};

module.exports = {requestOrder, getMyOrders, getOrders, getOrderById, updateOrderStatus};
