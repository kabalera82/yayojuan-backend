const express = require('express');
const {isAuth, isAdmin} = require('../middlewares/auth.middleware');
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/category.controller');

const router = express.Router();

router.get('/', getCategories);

router.post('/', isAuth, isAdmin, createCategory);
router.patch('/:id', isAuth, isAdmin, updateCategory);
router.delete('/:id', isAuth, isAdmin, deleteCategory);

module.exports = router;
