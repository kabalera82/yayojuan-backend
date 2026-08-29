const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Registrar usuario
const register = async (req, res) => {
  try {
    const {username, userSurname, email, phone, password} = req.body;

    if (!username || !userSurname || !email || !phone || !password) {
      return res.status(400).json({message: 'Todos los campos son obligatorios'});
    }

    const newUser = new User({username, userSurname, email, phone, password});

    await newUser.save();

    return res.status(201).json({message: 'Usuario creado correctamente'});
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({message: 'Ese email ya está registrado'});
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({message: error.message});
    }
    return res.status(500).json({message: 'Error al crear el usuario'});
  }
};

// Comprobar usuario y devolver token de autenticación (login)
const login = async (req, res) => {
  try {
    const {email, password} = req.body;

    if (!email || !password) {
      return res.status(400).json({message: 'Todos los campos son obligatorios'});
    }

    const user = await User.findOne({email});

    if (!user) {
      return res.status(400).json({message: 'Usuario no encontrado'});
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({message: 'Contraseña incorrecta'});
    }

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

    const userLogin = await User.findById(user._id).select('-password');

    return res.status(200).json({
      token,
      user: userLogin
    });
  } catch (error) {
    return res.status(500).json({error: error.message});
  }
};

// Devuelve los datos públicos del usuario autenticado sin revelar contraseña
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({error: error.message});
  }
};

// Campos del perfil que se pueden actualizar desde este endpoint.
// password y role quedan fuera a propósito: cada uno necesita su propio flujo.
const UPDATABLE_FIELDS = ['username', 'userSurname', 'email', 'phone'];

// Actualiza el perfil del usuario autenticado con el formulario completo
const updateUser = async (req, res) => {
  try {
    for (const field of UPDATABLE_FIELDS) {
      if (req.body[field] !== undefined) {
        req.user[field] = req.body[field];
      }
    }

    await req.user.save();

    return res.status(200).json({message: 'Perfil actualizado correctamente'});
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({message: 'Ese email ya está registrado'});
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({message: error.message});
    }
    return res.status(500).json({message: 'Error al actualizar el perfil'});
  }
};

// Actualiza la contraseña del usuario autenticado verificando la contraseña actual
const updatePassword = async (req, res) => {
  try {
    const {currentPassword, newPassword} = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({message: 'Todos los campos son obligatorios'});
    }

    const passwordMatch = bcrypt.compareSync(currentPassword, req.user.password);
    if (!passwordMatch) {
      return res.status(400).json({message: 'Contraseña incorrecta'});
    }
    req.user.password = newPassword;
    await req.user.save();
    return res.status(200).json({message: 'Contraseña actualizada correctamente'});
  } catch (error) {
    return res.status(500).json({error: error.message});
  }
};

module.exports = {register, login, getMe, updateUser, updatePassword};
