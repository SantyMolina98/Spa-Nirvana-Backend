const {response, request} = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuarios');

//Obtener usuarios
const getUsuarios = async(req = request, res = response) => {
    const {desde = 0, limite = 15} = req.query;
    const query = {estado: true};

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(desde)
            .limit(limite)
    ]);
    res.json({
        mensaje:'Usuarios obtenidos',
        total,
        usuarios
    });
}

const usuarioGetID = async(req = request, res = response) => {
    const {id} = req.params;

    const usuario = await Usuario.findById(id);
    res.json({
        mensaje: 'Usuario obtenido',
        usuario
    });
}

const usuarioPost = async(req = request, res = response) => {
    //Recibir el body
    const datos = req.body;

    const {nombre,apellido,username, telefono, domicilio, ciudad, codpostal, correo, password, rol} = datos;
    const usuario = new Usuario({nombre, apellido, username, telefono, domicilio, ciudad, codpostal, correo, password, rol});

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync(10);
    const hash = bcryptjs.hashSync(password, salt);
    usuario.password =  hash;

    //Guardar en BD
    await usuario.save();

    res.json({
        mensaje: 'Usuario creado correctamente',
        usuario
    });
}

const usuarioPut = async(req = request, res = response) => {
    const {id} = req.params;

    //Obtener los datos a actualizar
    const {password, correo, username, telefono, domicilio, ciudad, codpostal, ...resto} = req.body;

    //Si actualiza la contraseña, encriptar
    if(password){
        const salt = bcryptjs.genSaltSync(10);
        resto.password = bcryptjs.hashSync(password, salt);
    }

    //Modificación de datos
    resto.correo = correo;

    //Buscar el usuario por ID y actualizar
    const usuarioActualizado = await Usuario.findByIdAndUpdate(id, resto, {new: true});

    res.json({
        mensaje: 'Usuario actualizado correctamente',
        usuarioActualizado
    });
}

const deleteUsuario = async(req = request, res = response) => {
    const {id} = req.params;

    //Borrado lógico
    const usuario = await Usuario.findById(id);

    if(!usuario.estado){
        return res.status(400).json({
            mensaje: 'El usuario ya se encuentra eliminado'
        });
    }

    const usuarioInhabilitado = await Usuario.findByIdAndUpdate(id, {estado: false}, {new: true});

    res.json({
        mensaje: 'Usuario eliminado correctamente',
        usuarioInhabilitado
    });
}

module.exports = {
    getUsuarios,
    usuarioGetID,
    usuarioPost,
    usuarioPut,
    deleteUsuario
}
