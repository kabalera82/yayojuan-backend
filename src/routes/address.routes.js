const express = require('express');
const {isAuth} = require('../middlewares/auth.middleware');
const {addAddress, updateAddress, deleteAddress} = require('../controllers/address.controller');

const router = express.Router();

// Todas las rutas de direcciones operan sobre el usuario autenticado
router.use(isAuth);

router.post('/', addAddress);
router.patch('/:addressId', updateAddress);
router.delete('/:addressId', deleteAddress);

module.exports = router;
