const {request, response} = require('express');
const { Reserva } = require('../models/reserva');
const bcryptjs = require('bcryptjs');

// GET para administrador: obtener todas las reservas
const getReservasAdmin = async (req = request, res = response) => {
  const {desde = 0, limite = 100} = req.query;
  const query = {estado : 'confirmado'};

  try {
    const [ total, reservas ] = await Promise.all([
      Servicio.countDocuments(query),
      Servicio.find(query)
      .skip(Number(desde))
      .limit(Number(limite))
      .populate('usuario', 'nombre apellido correo')
      .populate('servicio', 'nombre descripcion')
    ]);
      
    res.json({
      msg:'Reservas obtenidas exitósamente',
      total,
      reservas
    });
  } catch (error) {
    res.status(500).json({
      msg: 'Error al obtener reservas'
    });
  }
};

// GET para usuario: obtener sus propias reservas
const getReservasUsuario = async (req = request, res = response) => {
  try {
    const { uid } = req; // Asume que el middleware de autenticación agrega uid al req
    const reservas = await Reserva.find({ usuario: uid })
      .populate('servicio', 'nombre descripcion'); // Ajusta campos
    res.json({
      ok: true,
      reservas
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error al obtener reservas del usuario'
    });
  }
};

module.exports ={
  getReservasAdmin,
  getReservasUsuario
}