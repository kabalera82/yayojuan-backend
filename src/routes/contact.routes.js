const express = require('express');
const {isAuth, isAdmin} = require('../middlewares/auth.middleware');
const {createContact, getContacts, deleteContact} = require('../controllers/contact.controller');

const router = express.Router();

// Cualquiera puede enviar un mensaje de contacto
router.post('/', createContact);

// Solo un admin puede leer o borrar los mensajes recibidos
router.get('/', isAuth, isAdmin, getContacts);
router.delete('/:id', isAuth, isAdmin, deleteContact);

module.exports = router;
