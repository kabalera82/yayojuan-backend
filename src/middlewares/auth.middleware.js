const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const isAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({message: 'No autenticado'});
    }

    const token = authHeader.replace('Bearer ', '');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('+password');

    if (!user) {
      return res.status(401).json({message: 'No autenticado'});
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({message: 'No autenticado'});
  }
};

module.exports = isAuth;
