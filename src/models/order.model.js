const mongoose = require('mongoose');

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
