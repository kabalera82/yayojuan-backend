const Product = require('../models/product.model');

const UPDATABLE_FIELDS = ['name', 'category', 'description', 'price', 'stock', 'image'];

// Lista los productos, opcionalmente filtrados por categoría (?category=<id>)
const getProducts = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const products = await Product.find(filter).populate('category').sort({name: 1});
    return res.status(200).json(products);
  } catch {
    return res.status(500).json({message: 'Error al obtener los productos'});
  }
};

// Devuelve un producto por su id
const getProductById = async (req, res) => {
  try {
    const {id} = req.params;
    const product = await Product.findById(id).populate('category');

    if (!product) {
      return res.status(404).json({message: 'Producto no encontrado'});
    }

    return res.status(200).json(product);
  } catch {
    return res.status(500).json({message: 'Error al obtener el producto'});
  }
};

// Crea un nuevo producto
const createProduct = async (req, res) => {
  try {
    const {name, category, description, price, stock, image} = req.body;

    if (!name || !category) {
      return res.status(400).json({message: 'El nombre y la categoría son obligatorios'});
    }

    const product = await Product.create({name, category, description, price, stock, image});

    return res.status(201).json(product);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({message: 'Ya existe un producto con ese nombre'});
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({message: error.message});
    }
    return res.status(500).json({message: 'Error al crear el producto'});
  }
};

// Actualiza un producto existente
const updateProduct = async (req, res) => {
  try {
    const {id} = req.params;
    const updates = {};

    for (const field of UPDATABLE_FIELDS) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    }).populate('category');

    if (!product) {
      return res.status(404).json({message: 'Producto no encontrado'});
    }

    return res.status(200).json(product);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({message: 'Ya existe un producto con ese nombre'});
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({message: error.message});
    }
    return res.status(500).json({message: 'Error al actualizar el producto'});
  }
};

// Elimina un producto
const deleteProduct = async (req, res) => {
  try {
    const {id} = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({message: 'Producto no encontrado'});
    }

    return res.status(200).json({message: 'Producto eliminado correctamente'});
  } catch {
    return res.status(500).json({message: 'Error al eliminar el producto'});
  }
};

module.exports = {getProducts, getProductById, createProduct, updateProduct, deleteProduct};
