const { Router } = require('express');
const { getServicios, getServicioID, postServicio, putServicio, deleteServicio } = require('../controllers/controlServicios');
const router = Router();

router.get('/', getServicios);

router.get('/:id', getServicioID);

router.post('/', postServicio);

router.put('/:id', putServicio);

router.delete('/:id', deleteServicio);

module.exports = router;