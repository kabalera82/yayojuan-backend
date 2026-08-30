require('dotenv').config();

const express = require('express');
const cors = require('cors');

const connectionDB = require('./src/config/db');
const userRoutes = require('./src/routes/user.routes');
const addressRoutes = require('./src/routes/address.routes');
const categoryRoutes = require('./src/routes/category.routes');
const productRoutes = require('./src/routes/product.routes');
const orderRoutes = require('./src/routes/order.routes');
const contactRoutes = require('./src/routes/contact.routes');

// Conexion
connectionDB();

// Creamos el Servidor
const app = express();
const PORT = 3000;

// Middlewares ---------------
app.use(
  cors({
    origin: 'http://localhost:5173' //
  })
);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);

// Pruebas
app.get('/pruebas', (req, res) => {
  console.log('Petición de prueba recibida');
  return res.status(200).send(`
  <h1>Servidor funcionando correctamente</h1>
  `);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT} 🎉🎉🎉🎉`);
});
