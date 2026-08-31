const Order = require('../models/order.model');
const Product = require('../models/product.model');
const sendTelegramMessage = require('../config/telegram');
const {aTexto, aObjetos} = require('./csv');

async function crearPedido(user, items) {
  if (!Array.isArray(items) || !items.length) {
    return {message: 'El carrito está vacío'};
  }

  const address = user.addresses.find((entry) => entry.isDefault) || user.addresses[0];

  if (!address) {
    return {message: 'Añade una dirección de envío antes de solicitar el pedido'};
  }

  const products = await Product.find({_id: {$in: items.map((item) => item.product)}});

  if (products.length !== items.length) {
    return {message: 'Algún producto del carrito ya no está disponible'};
  }

  const orderItems = [];

  for (const item of items) {
    const product = products.find((entry) => entry._id.equals(item.product));

    if (item.quantity > product.stock) {
      return {message: `No hay stock suficiente de ${product.name}`};
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
    user: user._id,
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
      `Cliente: ${user.username} ${user.userSurname}\n` +
      `Email: ${user.email}\n` +
      `Teléfono: ${user.phone}\n` +
      `Envío: ${address.street}, ${address.postalCode} ${address.city} (${address.country})\n\n` +
      `${lines.join('\n')}\n\n` +
      `Total: ${totalPrice.toFixed(2)} €`
  );

  return order;
}

async function actualizarPedido(id, items) {
  if (!Array.isArray(items) || !items.length) {
    return {message: 'El pedido debe tener al menos un producto'};
  }

  const products = await Product.find({_id: {$in: items.map((item) => item.product)}});

  if (products.length !== items.length) {
    return {message: 'Algún producto del pedido ya no está disponible'};
  }

  const orderItems = items.map((item) => {
    const product = products.find((entry) => entry._id.equals(item.product));

    return {
      product: product._id,
      name: product.name,
      quantity: item.quantity,
      price: product.price
    };
  });

  const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = await Order.findByIdAndUpdate(
    id,
    {items: orderItems, totalPrice},
    {new: true, runValidators: true}
  );

  if (!order) {
    return {message: 'Pedido no encontrado'};
  }

  return order;
}

const CABECERAS_LISTA = ['Id', 'Fecha', 'Email', 'Articulos', 'Total', 'Estado'];

function pedidosATexto(pedidos) {
  return aTexto(CABECERAS_LISTA, pedidos);
}

function textoAPedidos(texto) {
  return aObjetos(texto, CABECERAS_LISTA);
}

module.exports = {
  crearPedido,
  actualizarPedido,
  pedidosATexto,
  textoAPedidos
};
