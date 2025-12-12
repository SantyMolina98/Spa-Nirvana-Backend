const { Router } = require('express');
const { getServicios, getServicioID, postServicio, putServicio, deleteServicio } = require('../controllers/controlServicios');
const { esServicioValido } = require('../helpers/db-validators');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');
const router = Router();

router.get('/', getServicios);

router.get('/:id', [
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(esServicioValido),
  validarCampos
],getServicioID);

router.post('/',[
  validarJWT,
  esAdminRole,
  check('nombre', 'El nombre del servicio es obligatorio').notEmpty(),
  check('categoria', 'La categoría es obligatoria').notEmpty(),
  check('precio', 'El precio es obligatorio').notEmpty(),
  check('disponible', 'La disponibilidad es obligatoria').notEmpty(),
  check('duracion', 'La duracion es obligatoria').notEmpty(),
  validarCampos
], postServicio);

router.put('/:id', [
  validarJWT,
  esAdminRole,
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(esServicioValido),
  validarCampos
],putServicio);

router.delete('/:id', [
  validarJWT,
  esAdminRole,
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(esServicioValido),
  validarCampos
],deleteServicio);

module.exports = router;