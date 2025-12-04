const { Router } = require('express');
const { getCategorias, getCategoriasID, postCategoria, putCategoria, deleteCategoria } = require('../controllers/controlCategorias');
const router = Router();

router.get('/', getCategorias);

router.get('/:id', getCategoriasID);

router.post('/', postCategoria);

router.put('/:id', putCategoria);

router.delete('/:id', deleteCategoria);

module.exports = router;