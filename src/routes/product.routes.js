const express = require('express');
const auth = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/isAdmin.middleware');
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
router.post('/', auth, isAdmin, createProduct);
router.patch('/:id', auth, isAdmin, updateProduct);
router.delete('/:id', auth, isAdmin, deleteProduct);

module.exports = router;
