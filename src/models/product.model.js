const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    price: {
      type: Number,
      default: 0,
      min: 0
    },
    stock: {
      type: Number,
      default: 0,
      min: 0
    },
    image: {
      type: String,
      default:
        'https://res.cloudinary.com/dw6qgshkz/image/upload/v1786562117/Profile_avatar_placeholder_large_myyihb.png'
    },
    // Ventana de temporada del producto (1 = enero ... 12 = diciembre). Opcional: no todos
    // los productos (miel, legumbre seca...) están atados a un mes concreto.
    // Si startMonth > endMonth, la temporada cruza el fin de año (p. ej. 10 a 2 = octubre-febrero).
    season: {
      startMonth: {type: Number, min: 1, max: 12},
      endMonth: {type: Number, min: 1, max: 12}
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Inventario: un único producto por nombre.
ProductSchema.index({name: 1}, {unique: true});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
