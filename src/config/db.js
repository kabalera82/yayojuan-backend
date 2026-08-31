const mongoose = require('mongoose');

const validateEnv = () => {
  const url = process.env.DB_URL;

  if (!url) {
    throw new Error('Falta DB_URL en el archivo .env');
  }

  const isValidScheme = url.startsWith('mongodb://') || url.startsWith('mongodb+srv://');
  if (!isValidScheme) {
    throw new Error("DB_URL debe empezar por 'mongodb://' o 'mongodb+srv://'");
  }

  console.log('URL de conexión a la base de datos validada');
  return url;
};

const connectDB = async () => {
  try {
    const url = validateEnv();

    await mongoose.connect(url, {
      serverSelectionTimeoutMS: 5000
    });

    console.log('✅ Conectado a la base de datos 🥳🥳🥳🥳🥳');
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:');

    if (error.message.includes('Falta DB_URL')) {
      console.error(
        '👉 Causa: No existe DB_URL en tu .env. Revisa que el archivo esté cargado (dotenv).'
      );
    } else if (error.message.includes('debe empezar por')) {
      console.error('👉 Causa: ' + error.message);
    } else if (error.name === 'MongoParseError') {
      console.error('👉 Causa: La URL de conexión está mal escrita. Revisa tu archivo .env');
    } else if (
      error.message.includes('Authentication failed') ||
      error.message.includes('bad auth')
    ) {
      console.error('👉 Causa: El usuario o la contraseña de MongoDB son incorrectos.');
    } else if (
      error.name === 'MongooseServerSelectionError' ||
      error.message.includes('ECONNREFUSED')
    ) {
      console.error(
        '👉 Causa: Conexión rechazada o timeout. El puerto es incorrecto o MongoDB no está encendido.'
      );
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('👉 Causa: Host no encontrado. La dirección del servidor está mal.');
    } else {
      console.error('👉 Detalle del error:', error.message);
    }

    process.exit(1);
  }
};

module.exports = connectDB;
