const express = require('express');
const {isAuth, isAdmin} = require('../middlewares/auth.middleware');
const {
  requestOrder,
  getMyOrders,
  getOrders,
  getOrderById,
  updateOrderStatus
} = require('../controllers/order.controller');

const router = express.Router();

// Todas las rutas de pedidos requieren estar autenticado
router.use(isAuth);

router.post('/request', requestOrder);
router.get('/mine', getMyOrders);

// Gestión de pedidos: solo admin
router.get('/', isAdmin, getOrders);
router.patch('/:id/status', isAdmin, updateOrderStatus);

// Rutas con parámetro al final, para no capturar "/mine" ni las de arriba
router.get('/:id', getOrderById);

module.exports = router;
