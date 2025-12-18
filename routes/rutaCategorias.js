const { Router } = require('express');
const { getCategorias, getCategoriasID, postCategoria, putCategoria, deleteCategoria } = require('../controllers/controlCategorias');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esCategoriaValida } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { check } = require('express-validator');
const { esAdminRole } = require('../middlewares/validar-roles');
const router = Router();

router.get('/', [
  validarJWT
], getCategorias);

router.get('/:id', [
  validarJWT,
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(esCategoriaValida),
  validarCampos
], getCategoriasID);

router.post('/', [
  validarJWT,
  esAdminRole,
  check('nombre', 'El nombre de la categoría es obligatorio').notEmpty(),
  validarCampos
], postCategoria);

router.put('/:id', [
  validarJWT,
  esAdminRole,
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(esCategoriaValida),
  validarCampos
], putCategoria);

router.delete('/:id',[
  validarJWT,
  esAdminRole,
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(esCategoriaValida),
  validarCampos
], deleteCategoria);

module.exports = router;