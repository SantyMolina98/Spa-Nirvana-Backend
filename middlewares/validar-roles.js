const {request, response} = require('express');

const esAdminRole = (req = request, res = response, next) => {
  if (!req.usuario) {
   return res.status(500).json({
     msg: 'Se quiere verificar el rol sin validar el token primero'
    });
  }

  const {rol, nombre, apellido} = req.usuario;

  if (rol !== 'Admin') {
    return res.status(401).json({
      msg: `${nombre} ${apellido} no es administrador`
    });
  }

  next();
}

module.exports = {
  esAdminRole
}