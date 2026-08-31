const express = require('express');
const {isAuth, isAdmin} = require('../middlewares/auth.middleware');
const {createContact, getContacts, deleteContact} = require('../controllers/contact.controller');

const router = express.Router();

router.post('/', createContact);

router.get('/', isAuth, isAdmin, getContacts);
router.delete('/:id', isAuth, isAdmin, deleteContact);

module.exports = router;
