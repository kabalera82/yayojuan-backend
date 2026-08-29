const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;
