const {request, response} = require('express');
const { Reserva } = require('../models/reserva');

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

//Realiar una reserva como usuario
const postReserva = async (req = request, res = response) => {  
  const { uid } = req;
  const { servicio, fechaReserva, horaReserva, rol } = req.body;

  //Cargar una reserva como administrador
  if(rol === 'Admin'){
    try {
    const reserva = new Reserva({
      usuario: uid,
      servicio,
      fechaReserva,
      horaReserva
    });

    await reserva.save();

     res.json({
     ok: true,
     msg: 'Reserva realizada exitósamente',
     reserva
   });
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: 'Error al realizar la reserva'
      });
    }
  } else{
    if(rol === 'Usuario'){
      try {
        const reserva = new Reserva({
          usuario: uid,
          servicio,
          fechaReserva,
          horaReserva
        });

        await reserva.save();
      } catch (error) {
        res.status(500).json({
          ok: false,
          msg: 'Error al realizar la reserva'
        });
      }
    } else{
      return res.status(400).json({
        ok: false,
        msg: 'Rol no válido para realizar una reserva'
      });
    }
  } 
};

//Borrar una reserva como usuario
const deleteReserva = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const { uid } = req;
    const reserva = await Reserva.findById(id);

    if (!reserva) {
      return res.status(404).json({
        ok: false,
        msg: 'Reserva no encontrada'
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