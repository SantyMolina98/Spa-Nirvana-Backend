const {Schema, model} = require('mongoose');

const UsuarioSchema = Schema({  
    nombre:{type: String, required: [true, 'El nombre es obligatorio']}, 
    apellido:{type: String, required: [true, 'El apellido es obligatorio']} ,
    username:{type: String, required: [true, 'El nombre de usuario es obligatorio'], unique: true},
    correo:{type: String, required: [true, 'El correo es obligatorio'], unique: true},
    telefono:{type: Number, required: [true, 'El teléfono es obligatorio'], unique: true},
    domicilio:{type: String, required: [true, 'El domicilio es obligatorio']},
    ciudad:{type: String, required: [true, 'La ciudad es obligatoria'],
        enum:['Buenos Aires','Catamarca','Chaco','Chubut','Ciudad Autónoma de Buenos Aires','Córdoba','Corrientes','Entre Ríos','Formosa','Jujuy','La Pampa','La Rioja','Mendoza','Misiones','Neuquén','Río Negro','Salta','San Juan','San Luis','Santa Cruz','Santa Fe','Santiago del Estero','Tierra del Fuego','Tucumán']
    },
    codpostal:{type: Number, required: [true, 'El código postal es obligatorio']},
    password:{type: String, required: [true, 'La contraseña es obligatoria']},
    rol:{type: String, required: [true,'El rol es obligatorio']},
    img:{type: String},
    fechaRegistro:{type: Date, default: Date.now},
    estado:{type: Boolean, default: true}
})

module.exports = model('Usuario', UsuarioSchema);