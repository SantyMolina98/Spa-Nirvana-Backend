const {response, request} = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarios');

//Obtener usuarios
const getUsuarios = async(req = request, res = response) => {
    const {desde = 0, limite = 5} = req.query;
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

//Obtener profesionales
const getProfesionales = async(req = request, res = response) => {
    const {desde = 0, limite = 15} = req.query;
    const query = {estado: true, rol: 'Profesional'};
    const [total, profesionales] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(desde)
            .limit(limite)
    ]);
    res.json({
        mensaje:'Profesionales obtenidos',
        total,
        profesionales
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

//Obtener profesional por ID
const getProfesionalById = async(req = request, res = response) => {
    const {id} = req.params;
    const profesional = await Usuario.findById(id);
    if (profesional.rol !== 'Profesional') {
        return res.status(400).json({ mensaje: 'El usuario no es un profesional' });
    }
    res.json({
        mensaje:'Profesional obtenido',
        profesional
    });
}

const usuarioPost = async (req = request, res = response) => {
    const datos = req.body;
    const { nombre, apellido, username, correo, password, rol, telefono, domicilio, ciudad, codpostal, especialidad } = datos;
    const usuario = new Usuario({
        nombre,
        apellido,
        username,
        correo,
        password,
        rol,
        telefono,
        domicilio,
        ciudad,
        codpostal,
        especialidad: rol === 'Profesional' ? especialidad : undefined
    });
    const salt = bcryptjs.genSaltSync(10);
    const hash = bcryptjs.hashSync(password, salt);
    usuario.password = hash;
    try {
        await usuario.save();
        res.json({
            mensaje: 'Usuario creado correctamente',
            usuario
        });
    } catch (error) {
        console.log(error); 
        res.status(400).json({
            mensaje: 'Error al guardar el usuario',
            error: error.message 
        });
    }
}

const usuarioPut = async(req = request, res = response) => {
    const {id} = req.params;

    //Obtener los datos a actualizar
    const {password, correo, especialidad, ...resto} = req.body;

    //Si actualiza la contraseña, encriptar
    if(password){
        const salt = bcryptjs.genSaltSync(10);
        resto.password = bcryptjs.hashSync(password, salt);
    }

    //Modificación de datos
    resto.correo = correo;
    resto.especialidad = especialidad;

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

const olvidePassword = async (req = request, res = response) => {
    const { correo } = req.body;

    try {
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({ mensaje: 'El usuario no existe' });
        }
        const payload = { uid: usuario.id };
        const token = jwt.sign(payload, process.env.SECRET_KEY || 'mi_palabra_secreta', { expiresIn: '1h' });
        const link = `http://localhost:5173/RecuperarCuenta/${token}`;
        console.log(link); 
        res.json({
            mensaje: 'Se ha enviado un enlace a tu correo',
            link: link
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error interno' });
    }
};

//GUARDAR NUEVA CONTRASEÑA (usuario envía token)
const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const { uid } = jwt.verify(token, process.env.SECRET_KEY || 'mi_palabra_secreta');

        const usuario = await Usuario.findById(uid);
        if (!usuario) {
            return res.status(400).json({ mensaje: 'Usuario no válido' });
        }

        const salt = bcryptjs.genSaltSync(10);
        usuario.password = bcryptjs.hashSync(password, salt);

        await usuario.save();

        res.json({ mensaje: 'Contraseña restablecida correctamente' });

    } catch (error) {
        console.log(error);
        res.status(400).json({ mensaje: 'El enlace es inválido o ha expirado' });
    }
};

module.exports = {
    getUsuarios,
    getProfesionales,
    usuarioGetID,
    getProfesionalById,
    usuarioPost,
    usuarioPut,
    deleteUsuario,
    olvidePassword,
    nuevoPassword
}


