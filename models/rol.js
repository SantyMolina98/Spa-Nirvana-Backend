const {Schema, model} = require('mongoose');

const RolSchema = Schema({  
    rol:{type: String, required: [true, 'El rol es obligatorio'], 
        enum:['Admin', 'Usuario', 'Profesional']
    },
    descripcion:{type: String},
    estado:{type: Boolean, default: true},
    fechaRegistro:{type: Date, default: Date.now}
})

module.exports = model('Rol', RolSchema, 'rol');