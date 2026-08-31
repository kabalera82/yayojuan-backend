const express = require('express');
const {isAuth, isAdmin} = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const {
  requestOrder,
  getMyOrders,
  getOrders,
  getOrderById,
  updateOrderStatus,
  updateOrder
} = require('../controllers/order.controller');

const {exportarPedidos, importarPedidos} = require('../controllers/pedidoscsv.controller');

const router = express.Router();

router.use(isAuth);

router.post('/request', requestOrder);
router.get('/mine', getMyOrders);

router.get('/', isAdmin, getOrders);
router.get('/export', isAdmin, exportarPedidos);
router.post('/import', isAdmin, upload.single('file'), importarPedidos);
router.patch('/:id/status', isAdmin, updateOrderStatus);
router.patch('/:id', isAdmin, updateOrder);

router.get('/:id', getOrderById);

module.exports = router;
