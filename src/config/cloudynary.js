// src/config/cloudinary.js
// Cargamos las variables de entorno del archivo .env
require('dotenv').config();
// Importamos la librería de Cloudinary versión 2
const cloudinary = require('cloudinary').v2;

// Configuramos Cloudinary con las credenciales almacenadas en variables de entorno
cloudinary.config({
  // El identificador único del proyecto en Cloudinary
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  // La clave pública para autenticar peticiones básicas
  api_key: process.env.CLOUDINARY_API_KEY,
  // La clave privada para operaciones seguras y transformaciones
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Exportamos la instancia configurada para usarla en middlewares de subida de archivos
module.exports = cloudinary;
