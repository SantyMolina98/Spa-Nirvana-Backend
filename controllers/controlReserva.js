const {request, response} = require('express');
const Reserva = require('../models/reserva');

// GET para administrador: obtener todas las reservas
const getReservasAdmin = async (req = request, res = response) => {
  const {desde = 0, limite = 100} = req.query;
  const query = {estado : 'confirmada'};

  try {
    const [ total, reservas ] = await Promise.all([
      Reserva.countDocuments(query),
      Reserva.find(query)
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
    const usuario = req.usuario;
    const uid = usuario ? usuario._id : undefined;

    if (!uid) {
      return res.status(401).json({
        ok: false,
        msg: 'Token inválido o usuario no autenticado'
      });
    }

    const reservas = await Reserva.find({ usuario: uid })
      .populate('servicio', 'nombre descripcion'); // Ajusta campos
    res.json({
      ok: true,
      reservas
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'Error al obtener reservas del usuario'
    });
  }
};

//Realiar una reserva como usuario
const postReserva = async (req = request, res = response) => {  
  // Obtener usuario autenticado desde el middleware
  const usuario = req.usuario;
  const uid = usuario ? usuario._id : undefined;
  const { servicio, fechaReserva, horaReserva } = req.body;

  // Determinar rol
  const rol = (req.body.rol) ? req.body.rol : (usuario ? usuario.rol : undefined);

  if (!uid) {
    return res.status(401).json({
      ok: false,
      msg: 'Token inválido o usuario no autenticado'
    });
  }

  // Solo Admin o Usuario pueden crear reservas
  if (rol !== 'Admin' && rol !== 'Usuario') {
    return res.status(400).json({
      ok: false,
      msg: 'Rol no válido para realizar una reserva'
    });
  }

  try {
    const reserva = new Reserva({
      usuario: uid,
      servicio,
      fechaReserva,
      horaReserva,
      rol,
      estado: 'confirmada'
    });

    await reserva.save();

    return res.json({
      ok: true,
      msg: 'Reserva realizada exitósamente',
      reserva
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: 'Error al realizar la reserva'
    });
  }
};


//Borrar una reserva como usuario
const deleteReserva = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const usuario = req.usuario;
    const uid = usuario ? usuario._id.toString() : undefined;
    const reserva = await Reserva.findById(id);

    if (!reserva) {
      return res.status(404).json({
        ok: false,
        msg: 'Reserva no encontrada'
      });
    }

    if (!uid) {
      return res.status(401).json({
        ok: false,
        msg: 'Token inválido o usuario no autenticado'
      });
    }

    if (reserva.usuario.toString() !== uid) {
      return res.status(403).json({
        ok: false,
        msg: 'No tienes permiso para eliminar esta reserva'
      });
    }

    await Reserva.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: 'Reserva eliminada exitósamente'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'Error al eliminar la reserva'
    });
  }
};

module.exports ={
  getReservasAdmin,
  getReservasUsuario,
  postReserva,
  deleteReserva
}