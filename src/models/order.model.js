const mongoose = require('mongoose');

// Copia de cada línea del pedido: nombre y precio quedan fijados en el momento
// de la compra, aunque el producto cambie o se borre más adelante.
const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
});

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: (items) => items.length > 0,
        message: 'El pedido debe tener al menos un producto'
      }
    },
    // Copia de la dirección elegida: si el usuario la edita o la borra después,
    // el pedido conserva a dónde se envió de verdad.
    shippingAddress: {
      street: {type: String, required: true},
      city: {type: String, required: true},
      postalCode: {type: String, required: true},
      country: {type: String, default: 'España'}
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'],
      default: 'pendiente'
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
