const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const isAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(400).json({message: 'No autenticado'});
    }

    const token = authHeader.replace('Bearer ', '');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('+password');

    if (!user) {
      return res.status(400).json({message: 'No autenticado'});
    }

    req.user = user;
    next();
  } catch {
    return res.status(400).json({message: 'No autenticado'});
  }
};

const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(400).json({message: 'No tienes permisos para esta acción'});
  }
  next();
};

module.exports = {isAuth, isAdmin};
