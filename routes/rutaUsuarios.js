const {Router} = require('express');
const { check } = require('express-validator');
const { usuarioGetID, getUsuarios, usuarioPost, usuarioPut ,deleteUsuario } = require('../controllers/controlUsuarios');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');
const { validarCampos } = require('../middlewares/validar-campos');
const { esUsuarioValido, esemailValido, esRolValido } = require('../helpers/db-validators');

const router = Router();

//Obtener todos los usuarios
router.get('/', [
  validarJWT,
  esAdminRole
],getUsuarios);

router.get('/:id',[
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(esUsuarioValido),
  validarCampos,
], usuarioGetID);
   
//Crear un usuario
router.post('/', [
  check('nombre', 'El nombre es obligatorio').notEmpty(),
  check('apellido', 'El apellido es obligatorio').notEmpty(),
  check('username', 'El nombre de usuario es obligatorio').notEmpty(),
  check('telefono', 'El teléfono es obligatorio').notEmpty(),
  check('domicilio', 'El domicilio es obligatorio').notEmpty(),
  check('ciudad', 'La ciudad es obligatoria').notEmpty(),
  check('codpostal', 'El código postal es obligatorio').isLength(4),
  check('correo', 'El correo no es válido').custom(esemailValido),
  check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({min: 6}),
  check('rol').custom(esRolValido),
  validarCampos
],usuarioPost);

router.put('/:id', [
  validarJWT,
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(esUsuarioValido),
  validarCampos
],usuarioPut); 

router.delete('/:id', [
  validarJWT,
  esAdminRole,
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(esUsuarioValido),
  validarCampos
],deleteUsuario);

module.exports = router;