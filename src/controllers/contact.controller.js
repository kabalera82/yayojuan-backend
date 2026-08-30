const Contact = require('../models/contact.model');
const sendTelegramMessage = require('../config/telegram');

// Guarda un mensaje de contacto y avisa por Telegram si está configurado
const createContact = async (req, res) => {
  try {
    const {name, email, message} = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({message: 'Todos los campos son obligatorios'});
    }

    await Contact.create({name, email, message});

    await sendTelegramMessage(`Nuevo mensaje de contacto\nDe: ${name} (${email})\n\n${message}`);

    return res.status(200).json({message: 'Mensaje enviado correctamente'});
  } catch {
    return res.status(400).json({message: 'No se pudo enviar el mensaje'});
  }
};

// Lista los mensajes de contacto recibidos (admin)
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({createdAt: -1});
    return res.status(200).json(contacts);
  } catch {
    return res.status(400).json({message: 'No se pudieron obtener los mensajes'});
  }
};

module.exports = {createContact, getContacts};
