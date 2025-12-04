const {Router} = require('express');

const { usuarioGetID, getUsuarios, usuarioPost, usuarioPut ,deleteUsuario } = require('../controllers/controlUsuarios');

const router = Router();

//Obtener todos los usuarios
router.get('/', getUsuarios);

router.get('/:id', usuarioGetID);
   
//Crear un usuario
router.post('/', usuarioPost);

router.put('/:id', usuarioPut); 

router.delete('/:id', deleteUsuario);

module.exports = router;