const express = require('express');
const {isAuth, isAdmin} = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/product.controller');
const {exportarProductos, importarProductos} = require('../controllers/productoscsv.controller');

const router = express.Router();

router.get('/', getProducts);

router.get('/export', isAuth, isAdmin, exportarProductos);
router.post('/import', isAuth, isAdmin, upload.single('file'), importarProductos);

router.get('/:id', getProductById);

router.post('/', isAuth, isAdmin, upload.single('image'), createProduct);
router.patch('/:id', isAuth, isAdmin, upload.single('image'), updateProduct);
router.delete('/:id', isAuth, isAdmin, deleteProduct);

module.exports = router;
