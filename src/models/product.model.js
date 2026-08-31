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

ProductSchema.index({name: 1}, {unique: true});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
