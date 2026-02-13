const { Router } = require('express');
const { getReservasAdmin, postReserva, deleteReserva } = require('../controllers/controlReserva');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');
const router = Router();

// GET para administrador: obtener todas las reservas
router.get('/admin', [
  validarJWT,
  esAdminRole,
  validarCampos
], getReservasAdmin);

// POST: crear una reserva
router.post('/', [
  validarJWT,
  check('servicio', 'El servicio es obligatorio').notEmpty(),
  check('fechaReserva', 'La fecha de reserva es obligatoria').notEmpty(),
  check('horaReserva', 'La hora de reserva es obligatoria').notEmpty(),
  validarCampos
], postReserva);

// DELETE: eliminar una reserva (solo el usuario propietario)
router.delete('/:id', [
  validarJWT,
  check('id', 'No es un ID válido').isMongoId(),
  validarCampos
], deleteReserva);

module.exports = router;