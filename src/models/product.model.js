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
