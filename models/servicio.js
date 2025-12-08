const {Schema, model} = require('mongoose');

const ServicioSchema = Schema({  
    nombre:{type: String, required: [true, 'El nombre del servicio es obligatorio'], unique: true}, 
    categoria:{type: Schema.Types.ObjectId, ref: 'Categoria', required: true},
    precio:{type: Number, required: [true, 'El precio es obligatorio']},
    disponible:{type: Boolean, required: [true, 'La disponibilidad es obligatoria'], default: true} ,
    descripcion:{type: String},
    img:{type: String},
    duracion:{type: String, required: [true, 'La duracion es obligatoria']}, 
    destacado: {type: Boolean, default: false},
    fechaCreacion:{type: Date, default: Date.now},
    /* usuario:{type: Schema.Types.ObjectId, ref: 'Usuario', required: true}, */
    
})

module.exports = model('Servicio', ServicioSchema);