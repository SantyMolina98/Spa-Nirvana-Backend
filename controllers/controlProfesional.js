const {request, response} = require('express');
const Profesional = require('../models/profesional');
const bcryptjs = require('bcryptjs');

//Obtener profesionales
const getProfesionales = async(req = request, res = response) => {
    const {desde = 0, limite = 15} = req.query;
    const query = {estado: true};
    const [total, profesionales] = await Promise.all([
        Profesional.countDocuments(query),
        Profesional.find(query)
            .skip(desde)
            .limit(limite)
    ]);
    res.json({
        mensaje:'Profesionales obtenidos',
        total,
        profesionales
    });
}

//Obtener profesional por ID
const getProfesionalById = async(req = request, res = response) => {
    const {id} = req.params;
    const profesional = await Profesional.findById(id);
    res.json({
        mensaje:'Profesional obtenido',
        profesional
    });
}

//Cargar un nuevo profesional
const postProfesional = async(req = request, res = response) => {
    const datos = req.body;
    const {nombre, apellido, especialidad, telefono, correo, domicilio, password} = datos;
    const profesional = new Profesional({nombre, apellido, especialidad, telefono, correo, domicilio, password});
    await profesional.save();
    res.json({
        mensaje: `Profesional ${nombre} creado correctamente`,
        profesional
    });
}

//Actualizar datos de un profesional
const putProfesional = async(req = request, res = response) => {
    const {id} = req.params;
    const {nombre, apellido, especialidad, telefono, correo, domicilio, password, estado, fechaRegistro, ...resto} = req.body;

    //Si actualiza la contraseña, encriptar
    if(password){
      const salt = bcryptjs.genSaltSync(10);
      resto.password = bcryptjs.hashSync(password, salt);
    }
    //modificación de datos
    resto.correo = correo;

    const profesionalNew = await Profesional.findByIdAndUpdate(id, resto, {new: true});
    res.json({
        mensaje: 'Profesional actualizado',
        profesionalNew
    });
}

//Eliminar un profesional
const deleteProfesional = async(req = request, res = response) => {
    const {id} = req.params;
    const profesionalDelete = await Profesional.findByIdAndUpdate(id, {estado: false}, {new: true});
    res.json({
        mensaje: 'Profesional eliminado',
        profesionalDelete
    });
}

module.exports = {
    getProfesionales,
    getProfesionalById,
    postProfesional,
    putProfesional,
    deleteProfesional
}