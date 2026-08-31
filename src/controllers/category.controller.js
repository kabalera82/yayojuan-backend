const Category = require('../models/category.model');

// Lista todas las categorías
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({name: 1});
    return res.status(200).json(categories);
  } catch {
    return res.status(400).json({message: 'No se pudieron obtener las categorías'});
  }
};

// Crea una nueva categoría
const createCategory = async (req, res) => {
  try {
    const {name} = req.body;

    if (!name) {
      return res.status(400).json({message: 'El nombre de la categoría es obligatorio'});
    }

    const category = await Category.create({name});

    return res.status(200).json(category);
  } catch {
    return res.status(400).json({message: 'No se pudo crear la categoría'});
  }
};

// Actualiza una categoría existente
const updateCategory = async (req, res) => {
  try {
    const {id} = req.params;
    const {name} = req.body;

    if (!name) {
      return res.status(400).json({message: 'El nombre de la categoría es obligatorio'});
    }

    const category = await Category.findByIdAndUpdate(id, {name}, {new: true, runValidators: true});

    if (!category) {
      return res.status(400).json({message: 'Categoría no encontrada'});
    }

    return res.status(200).json(category);
  } catch {
    return res.status(400).json({message: 'No se pudo actualizar la categoría'});
  }
};

// Elimina una categoría
const deleteCategory = async (req, res) => {
  try {
    const {id} = req.params;

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(400).json({message: 'Categoría no encontrada'});
    }

    return res.status(200).json({message: 'Categoría eliminada correctamente'});
  } catch {
    return res.status(400).json({message: 'No se pudo eliminar la categoría'});
  }
};

module.exports = {getCategories, createCategory, updateCategory, deleteCategory};
