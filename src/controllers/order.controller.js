const Order = require('../models/order.model');

// Crea un pedido a partir del carrito del usuario autenticado y una dirección ya guardada
const createOrder = async (req, res) => {
  try {
    const {addressId} = req.body;

    if (!req.user.cart.length) {
      return res.status(400).json({message: 'El carrito está vacío'});
    }

    const address = req.user.addresses.id(addressId);
    if (!address) {
      return res.status(400).json({message: 'Dirección de envío no encontrada'});
    }

    await req.user.populate('cart.product');

    const items = req.user.cart.map((entry) => ({
      product: entry.product._id,
      name: entry.product.name,
      quantity: entry.quantity,
      price: entry.product.price
    }));

    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress: {
        street: address.street,
        city: address.city,
        postalCode: address.postalCode,
        country: address.country
      },
      totalPrice
    });

    req.user.cart = [];
    await req.user.save();

    return res.status(201).json(order);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({message: error.message});
    }
    return res.status(500).json({message: 'Error al crear el pedido'});
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
    return res.status(500).json({message: 'Error al obtener los pedidos'});
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
    return res.status(500).json({message: 'Error al obtener los pedidos'});
  }
};

// Detalle de un pedido: su dueño o un admin
const getOrderById = async (req, res) => {
  try {
    const {id} = req.params;
    const order = await Order.findById(id).populate('user', 'username email');

    if (!order) {
      return res.status(404).json({message: 'Pedido no encontrado'});
    }

    const isOwner = order.user._id.equals(req.user._id);
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({message: 'No tienes permisos para ver este pedido'});
    }

    return res.status(200).json(order);
  } catch {
    return res.status(500).json({message: 'Error al obtener el pedido'});
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
      return res.status(404).json({message: 'Pedido no encontrado'});
    }

    return res.status(200).json(order);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({message: error.message});
    }
    return res.status(500).json({message: 'Error al actualizar el pedido'});
  }
};

module.exports = {createOrder, getMyOrders, getOrders, getOrderById, updateOrderStatus};
