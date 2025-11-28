const {Router} = require('express');
const { get } = require('mongoose');

const router = Router();

//Obtener todos los usuarios
router.get('/', (req, res) => {
    res.json({
        msg: 'GET usuarios'
    });
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    res.json({
        msg: 'GET usuario ' + id
    });
});

//Crear un usuario
router.post('/', (req, res) => {
    const body = req.body;
    res.json({
        msg: 'POST usuario',
        body
    });
});

router.put('/:id', (req, res) => {
    const id = req.params.id;
    const body = req.body;
    res.json({
        msg: 'PUT usuario ' + id,
        body
    });
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    res.json({
        msg: 'DELETE usuario ' + id
    });
});

module.exports = router;