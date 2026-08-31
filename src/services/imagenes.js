const cloudinary = require('../config/cloudynary');

async function subirImagen(file) {
  const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
  const resultado = await cloudinary.uploader.upload(base64, {folder: 'productos'});

  return resultado.secure_url;
}

module.exports = {subirImagen};
