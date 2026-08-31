const Product = require('../models/product.model');
const {subirImagen} = require('../services/imagenes');

const UPDATABLE_FIELDS = ['name', 'category', 'description', 'price', 'stock', 'image', 'season'];

const getProducts = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const products = await Product.find(filter).populate('category').sort({name: 1});
    return res.status(200).json(products);
  } catch {
    return res.status(400).json({message: 'No se pudieron obtener los productos'});
  }
};

const getProductById = async (req, res) => {
  try {
    const {id} = req.params;
    const product = await Product.findById(id).populate('category');

    if (!product) {
      return res.status(400).json({message: 'Producto no encontrado'});
    }

    return res.status(200).json(product);
  } catch {
    return res.status(400).json({message: 'No se pudo obtener el producto'});
  }
};

const createProduct = async (req, res) => {
  try {
    const {name, category, description, price, stock, season} = req.body;

    if (!name || !category) {
      return res.status(400).json({message: 'El nombre y la categoría son obligatorios'});
    }

    const image = req.file ? await subirImagen(req.file) : undefined;

    const product = await Product.create({
      name,
      category,
      description,
      price,
      stock,
      image,
      season
    });

    return res.status(200).json(product);
  } catch {
    return res.status(400).json({message: 'No se pudo crear el producto'});
  }
};

const updateProduct = async (req, res) => {
  try {
    const {id} = req.params;
    const updates = {};

    for (const field of UPDATABLE_FIELDS) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (req.file) {
      updates.image = await subirImagen(req.file);
    }

    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    }).populate('category');

    if (!product) {
      return res.status(400).json({message: 'Producto no encontrado'});
    }

    return res.status(200).json(product);
  } catch {
    return res.status(400).json({message: 'No se pudo actualizar el producto'});
  }
};

const deleteProduct = async (req, res) => {
  try {
    const {id} = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(400).json({message: 'Producto no encontrado'});
    }

    return res.status(200).json({message: 'Producto eliminado correctamente'});
  } catch {
    return res.status(400).json({message: 'No se pudo eliminar el producto'});
  }
};

module.exports = {getProducts, getProductById, createProduct, updateProduct, deleteProduct};
