const express = require('express');
const isAuth = require('../middlewares/auth.middleware');
const {
  register,
  login,
  getMe,
  updateUser,
  updatePassword
} = require('../controllers/user.controller');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', isAuth, getMe);
router.patch('/me', isAuth, updateUser);
router.patch('/me/password', isAuth, updatePassword);

module.exports = router;
