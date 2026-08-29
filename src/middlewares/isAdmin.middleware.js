// Debe ir después de auth: exige que el usuario autenticado tenga role "admin"
const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({message: 'No tienes permisos para esta acción'});
  }
  next();
};

module.exports = isAdmin;
