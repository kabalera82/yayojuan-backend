const express = require('express');
const auth = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/isAdmin.middleware');
const {createContact, getContacts} = require('../controllers/contact.controller');

const router = express.Router();

// Cualquiera puede enviar un mensaje de contacto
router.post('/', createContact);

// Solo un admin puede leer los mensajes recibidos
router.get('/', auth, isAdmin, getContacts);

module.exports = router;
