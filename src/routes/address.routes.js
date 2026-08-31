const express = require('express');
const {isAuth} = require('../middlewares/auth.middleware');
const {addAddress, updateAddress, deleteAddress} = require('../controllers/address.controller');

const router = express.Router();

router.use(isAuth);

router.post('/', addAddress);
router.patch('/:addressId', updateAddress);
router.delete('/:addressId', deleteAddress);

module.exports = router;
