const express = require('express');
const {isAuth, isAdmin} = require('../middlewares/auth.middleware');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/product.controller');

const router = express.Router();

// Ver el catálogo es público
router.get('/', getProducts);
router.get('/:id', getProductById);

// Gestionar el catálogo es solo para admins
router.post('/', isAuth, isAdmin, createProduct);
router.patch('/:id', isAuth, isAdmin, updateProduct);
router.delete('/:id', isAuth, isAdmin, deleteProduct);

module.exports = router;
