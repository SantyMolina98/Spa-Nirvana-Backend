const {response, request} = require('express');

const Usuario = require('../models/usuario');

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

//Me quedé en la clase 3, minuto 1:00:00