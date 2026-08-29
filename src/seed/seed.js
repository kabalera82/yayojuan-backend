require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/user.model');
const Product = require('../models/product.model');
const Category = require('../models/category.model');

const seed = async () => {
  await connectDB();

  // Vaciamos las colecciones antes de insertar los datos de prueba
  await Promise.all([User.deleteMany(), Product.deleteMany(), Category.deleteMany()]);

  const categories = await Category.insertMany([
    {name: 'Verduras'},
    {name: 'Frutas'},
    {name: 'Legumbres'},
    {name: 'Otros'}
  ]);

  const [verduras, frutas, legumbres, otros] = categories;

  await Product.insertMany([
    {
      name: 'Tomate Raf',
      category: verduras._id,
      description: 'Tomate de temporada cultivado en Navarra',
      price: 3.5,
      stock: 40
    },
    {
      name: 'Pimiento del piquillo',
      category: verduras._id,
      description: 'Pimiento asado tradicional',
      price: 4.2,
      stock: 25
    },
    {
      name: 'Manzana Reineta',
      category: frutas._id,
      description: 'Manzana ácida, ideal para postres',
      price: 2.8,
      stock: 60
    },
    {
      name: 'Pera Conferencia',
      category: frutas._id,
      description: 'Pera dulce y jugosa',
      price: 2.5,
      stock: 35
    },
    {
      name: 'Alubia pinta',
      category: legumbres._id,
      description: 'Alubia seca de cosecha propia',
      price: 5.0,
      stock: 20
    },
    {
      name: 'Miel de Navarra',
      category: otros._id,
      description: 'Miel artesanal de la huerta',
      price: 6.5,
      stock: 15
    }
  ]);

  // User.create() dispara el hook pre-save que hashea la contraseña
  await User.create([
    {
      username: 'admin',
      userSurname: 'YayoJuan',
      email: 'admin@yayojuan.com',
      phone: '600000000',
      password: 'admin1234',
      role: 'admin'
    },
    {
      username: 'maria',
      userSurname: 'Garcia',
      email: 'maria@example.com',
      phone: '600000001',
      password: 'cliente1234',
      role: 'customer',
      addresses: [
        {
          street: 'Calle Mayor 1',
          city: 'Pamplona',
          postalCode: '31001',
          isDefault: true
        }
      ]
    }
  ]);

  console.warn('✅ Semilla insertada correctamente');
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((error) => {
  console.error('❌ Error al insertar la semilla:', error.message);
  process.exit(1);
});
