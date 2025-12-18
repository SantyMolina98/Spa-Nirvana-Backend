const {Schema, model} = require('mongoose');

const RolSchema = Schema({  
    rol:{type: String, required: [true, 'El rol es obligatorio'], unique: true},
    descripcion:{type: String},
    estado:{type: Boolean, default: true}
})

module.exports = model('Rol', RolSchema);