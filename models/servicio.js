const {Schema, model} = require('mongoose');

const ServicioSchema = Schema({  
    nombre:{type: String, required: [true, 'El nombre del servicio es obligatorio'], unique: true}, 
    estado:{type: Boolean, required: true, default: true} ,
    precio:{type: Number, required: [true, 'El precio es obligatorio']},
    descripcion:{type: String},
    img:{type: String},
    duracion:{type: Number, required: [true, 'La duracion es obligatoria']}, 
    destacado: {type: Boolean, default: false},
    disponible: {type: Boolean, default: true},
    fechaCreacion:{type: Date, default: Date.now},
    usuario:{type: Schema.Types.ObjectId, ref: 'Usuario', required: true},
    categoria:{type: Schema.Types.ObjectId, ref: 'Categoria', required: true},
})

module.exports = model('Servicio', ServicioSchema);