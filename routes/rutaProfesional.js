const { Router } = require('express');
const { check } = require('express-validator');
const { getProfesionales ,getProfesionalById, postProfesional, putProfesional, deleteProfesional } = require('../controllers/controlProfesional');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esProfesionalRole } = require('../middlewares/validar-roles');
const { validarCampos } = require('../middlewares/validar-campos');
const { esProfesionalValido, esemailValido, esRolValido } = require('../helpers/db-validators');

const router = Router();

//Obtener todos los profesionales
router.get('/', 
  [ validarJWT,
    esProfesionalRole
  ],
  getProfesionales);

//Obtener solo un profesional
router.get('/:id',
  [ check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(esProfesionalValido),
    validarCampos
  ],
  getProfesionalById
)

//Crear un profesional
router.post('/', [
  check('nombre', 'El nombre es obligatorio').notEmpty(),
  check('apellido', 'El apellido es obligatorio').notEmpty(),
  check('especialidad', 'La especialidad es obligatorio').notEmpty(),
  check('telefono', 'El teléfono es obligatorio').notEmpty(),
  check('correo', 'El correo no es válido').custom(esemailValido),
  check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({min: 6}),
  check('domicilio', 'El domicilio es obligatorio'),
  check('rol').custom(esRolValido),
  validarCampos
],
postProfesional);

router.put('/:id',[
  validarJWT,
  check('id', 'No es un ID de profesional válido').isMongoId(),
  check('id').custom(esProfesionalValido)
],
 putProfesional)

//Eliminar un profesional
router.delete('/:id', [
  validarJWT,
  esProfesionalRole,
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(esProfesionalValido),
  validarCampos
],deleteProfesional);

module.exports = router;
