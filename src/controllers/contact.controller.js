const Contact = require('../models/contact.model');
const sendTelegramMessage = require('../config/telegram');

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

const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({createdAt: -1});
    return res.status(200).json(contacts);
  } catch {
    return res.status(400).json({message: 'No se pudieron obtener los mensajes'});
  }
};

const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(400).json({message: 'Mensaje no encontrado'});
    }
    return res.status(200).json({message: 'Mensaje eliminado correctamente'});
  } catch {
    return res.status(400).json({message: 'No se pudo eliminar el mensaje'});
  }
};

module.exports = {createContact, getContacts, deleteContact};
