const express = require('express');
const auth = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/isAdmin.middleware');
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/category.controller');

const router = express.Router();

// Listar categorías es público: cualquiera navegando la tienda las necesita
router.get('/', getCategories);

// Gestionar el catálogo es solo para admins
router.post('/', auth, isAdmin, createCategory);
router.patch('/:id', auth, isAdmin, updateCategory);
router.delete('/:id', auth, isAdmin, deleteCategory);

module.exports = router;
