const {request, response} = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuarios');
const { generarJWT } = require('../helpers/generar-jwt');

const login = async (req = request, res = response) => {
  const { username, password } = req.body; 
  try{
    //Verificar si el email existe
    const usuario = await Usuario.findOne({username});

    if(!usuario){
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos '
      });
    }

    //Verificar si el usuario está activo
    if(!usuario.estado){
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos'
      });
    }

    //Verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if(!validPassword){
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos'
      });
    }

    //Generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
      msg: 'Login ok',
      usuario,
      token
    });
    

  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Hable con el administrador'
    });
  }
}

module.exports = {
  login
}