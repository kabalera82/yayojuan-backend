const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const register = async (req, res) => {
  try {
    const {username, userSurname, email, phone, password} = req.body;

    if (!username || !userSurname || !email || !phone || !password) {
      return res.status(400).json({message: 'Todos los campos son obligatorios'});
    }

    const newUser = new User({username, userSurname, email, phone, password});

    await newUser.save();

    return res.status(200).json({message: 'Usuario creado correctamente'});
  } catch {
    return res.status(400).json({message: 'No se pudo crear el usuario'});
  }
};

const createUser = async (req, res) => {
  try {
    const {username, userSurname, email, phone, password, role} = req.body;

    if (!username || !userSurname || !email || !phone || !password) {
      return res.status(400).json({message: 'Todos los campos son obligatorios'});
    }

    const newUser = new User({username, userSurname, email, phone, password, role});

    await newUser.save();

    return res.status(200).json({message: 'Usuario creado correctamente'});
  } catch {
    return res.status(400).json({message: 'No se pudo crear el usuario'});
  }
};

const login = async (req, res) => {
  try {
    const {email, password} = req.body;

    if (!email || !password) {
      return res.status(400).json({message: 'Todos los campos son obligatorios'});
    }

    const user = await User.findOne({email}).select('+password');

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
  } catch {
    return res.status(400).json({message: 'No se pudo iniciar sesión'});
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    return res.status(200).json(user);
  } catch {
    return res.status(400).json({message: 'No se pudo obtener el usuario'});
  }
};

const UPDATABLE_FIELDS = ['username', 'userSurname', 'email', 'phone'];

const updateUser = async (req, res) => {
  try {
    for (const field of UPDATABLE_FIELDS) {
      if (req.body[field] !== undefined) {
        req.user[field] = req.body[field];
      }
    }

    await req.user.save();

    return res.status(200).json({message: 'Perfil actualizado correctamente'});
  } catch {
    return res.status(400).json({message: 'No se pudo actualizar el perfil'});
  }
};

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
  } catch {
    return res.status(400).json({message: 'No se pudo actualizar la contraseña'});
  }
};

const deleteMe = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    return res.status(200).json({message: 'Cuenta eliminada correctamente'});
  } catch {
    return res.status(400).json({message: 'No se pudo eliminar la cuenta'});
  }
};

const deleteUser = async (req, res) => {
  try {
    const {id} = req.params;

    if (req.user._id.equals(id)) {
      return res.status(400).json({message: 'No puedes eliminar tu propia cuenta desde aquí'});
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(400).json({message: 'Usuario no encontrado'});
    }

    return res.status(200).json({message: 'Usuario eliminado correctamente'});
  } catch {
    return res.status(400).json({message: 'No se pudo eliminar el usuario'});
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({username: 1});
    return res.status(200).json(users);
  } catch {
    return res.status(400).json({message: 'No se pudo obtener la lista de usuarios'});
  }
};

module.exports = {
  register,
  createUser,
  login,
  getMe,
  updateUser,
  updatePassword,
  deleteMe,
  deleteUser,
  getUsers
};
