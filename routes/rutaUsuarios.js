const {Router} = require('express');
const { check } = require('express-validator');
const { usuarioGetID, getUsuarios, usuarioPost, usuarioPut ,deleteUsuario, olvidePassword, 
    nuevoPassword, getProfesionales, getProfesionalById  } = require('../controllers/controlUsuarios');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');
const { validarCampos } = require('../middlewares/validar-campos');
const { esUsuarioValido, esemailValido, esRolValido, esCategoriaValida, esServicioValido } = require('../helpers/db-validators');

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
  check('telefono', 'El teléfono es obligatorio').notEmpty(),
  check('domicilio', 'El domicilio es obligatorio').notEmpty(),
  check('ciudad', 'La ciudad es obligatoria').notEmpty(),
  check('codpostal', 'El código postal es obligatorio').isLength(4),
  check('correo', 'El correo no es válido').custom(esemailValido),
  check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({min: 6}),
  check('rol').custom(esRolValido),
  check('especialidadCategoria', 'La especialidad de categoria es obligatoria para profesionales')
    .if(check('rol').equals('Profesional'))
    .isArray({ min: 1 })
    .custom(async (ids) => {
      for (const id of ids) {
        if (!id || typeof id !== 'string') {
          throw new Error('Cada especialidad de categoria debe ser un ID valido');
        }
        await esCategoriaValida(id);
      }
    }),
  check('especialidadCategoria.*', 'Cada especialidad de categoria debe ser un ID valido')
    .if(check('rol').equals('Profesional'))
    .isMongoId(),
  check('especialidadServicio', 'La especialidad de servicio es obligatoria para profesionales')
    .if(check('rol').equals('Profesional'))
    .isArray({ min: 1 })
    .custom(async (ids) => {
      for (const id of ids) {
        if (!id || typeof id !== 'string') {
          throw new Error('Cada especialidad de servicio debe ser un ID valido');
        }
        await esServicioValido(id);
      }
    }),
  check('especialidadServicio.*', 'Cada especialidad de servicio debe ser un ID valido')
    .if(check('rol').equals('Profesional'))
    .isMongoId(),
  check('agenda', 'La agenda es obligatoria para profesionales')
    .if(check('rol').equals('Profesional'))
    .isArray({ min: 1 })
    .custom((agenda) => {
      const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
      const slots = new Set();
      for (const item of agenda) {
        if (!item || !Array.isArray(item.horarios) || item.horarios.length === 0) {
          throw new Error('Cada item de agenda debe tener horarios');
        }
        for (const horario of item.horarios) {
          if (!timeRegex.test(horario)) {
            throw new Error('Los horarios deben tener formato HH:MM');
          }
          const slotKey = `${item.dia}|${horario}`;
          if (slots.has(slotKey)) {
            throw new Error('No se permiten horarios repetidos en la agenda');
          }
          slots.add(slotKey);
        }
      }
      return true;
    }),
  check('agenda.*.servicio', 'Cada servicio de la agenda debe ser un ID valido')
    .if(check('rol').equals('Profesional'))
    .isMongoId()
    .custom(esServicioValido),
  check('agenda.*.dia', 'El dia de la agenda no es valido')
    .if(check('rol').equals('Profesional'))
    .isIn(['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']),
  check('agenda.*.horarios', 'Los horarios de la agenda son obligatorios')
    .if(check('rol').equals('Profesional'))
    .isArray({ min: 1 }),
  check('agenda.*.horarios.*', 'Cada horario debe tener formato HH:MM')
    .if(check('rol').equals('Profesional'))
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/),
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

router.post('/olvide-password', [
    check('correo', 'El correo no es válido').isEmail(),
    validarCampos
], olvidePassword);

router.post('/nuevo-password/:token', [
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({min: 6}),
    validarCampos
], nuevoPassword);

// Rutas para profesionales
//Obtener todos los profesionales
router.get('/profesionales', [
  validarJWT,
  esAdminRole
], getProfesionales);

//Obtener profesional por ID
router.get('/profesionales/:id',[
  validarJWT,
  esAdminRole,
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(esUsuarioValido),
  validarCampos,
], getProfesionalById);

module.exports = router;