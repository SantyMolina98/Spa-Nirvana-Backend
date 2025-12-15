const {request, response} = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarios');

const validarJWT = async (req = request, res = response, next) => {
  const token = req.header('x-token');

  if (!token) {
    return res.status(401).json({
      msg: 'No hay token en la petición'
    });
  }

  try{
    //Verificar el token
    const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);


    //Obytener el usuario que corresponde al uid
    const usuario = await Usuario.findById(uid);

    //Validar que el usuario exista
    if (!usuario) {
      return res.status(401).json({
        msg: 'Token no válido - usuario no existe'
      });
    }

    //Validar que el usuario esté activo
    if(!usuario.estado){
      return res.status(401).json({
        msg: 'Token no válido - usuario inactivo'
      });
    }

    //Si todo está bien, agregamos el usuario a la request
    req.usuario = usuario;
    console.log(req.usuario);
    next();
    
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: 'Token no válido'
    });
  }
}

module.exports = {
  validarJWT
}