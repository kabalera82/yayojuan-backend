const express = require('express');
const {isAuth, isAdmin} = require('../middlewares/auth.middleware');
const {
  register,
  createUser,
  login,
  getMe,
  updateUser,
  updatePassword,
  deleteMe,
  deleteUser,
  getUsers
} = require('../controllers/user.controller');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/me', isAuth, getMe);
router.patch('/me', isAuth, updateUser);
router.patch('/me/password', isAuth, updatePassword);
router.delete('/me', isAuth, deleteMe);

router.get('/', isAuth, isAdmin, getUsers);
router.post('/', isAuth, isAdmin, createUser);
router.delete('/:id', isAuth, isAdmin, deleteUser);

module.exports = router;
