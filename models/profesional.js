const {Schema, model} = require('mongoose');

const ProfesionalSchema = Schema({  
    nombre:{type: String, required: [true, 'El nombre es obligatorio']}, 
    apellido:{type: String, required: [true, 'El apellido es obligatorio']} ,
    especialidad:{type: String, required: [true, 'La especialidad es obligatoria']},
    telefono:{type: Number, required: [true, 'El teléfono es obligatorio'], unique: true},
    correo:{type: String, required: [true, 'El correo es obligatorio'], unique: true},
    password:{type: String, required: [true, 'La contraseña es obligatoria']},
    domicilio:{type: String, required: [true, 'El domicilio es obligatorio']},
    fechaRegistro:{type: Date, default: Date.now},
    estado:{type: Boolean, default: true}
});

module.exports = model('Profesional', ProfesionalSchema);