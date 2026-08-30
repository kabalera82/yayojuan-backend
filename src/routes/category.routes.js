const express = require('express');
const {isAuth, isAdmin} = require('../middlewares/auth.middleware');
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
router.post('/', isAuth, isAdmin, createCategory);
router.patch('/:id', isAuth, isAdmin, updateCategory);
router.delete('/:id', isAuth, isAdmin, deleteCategory);

module.exports = router;
