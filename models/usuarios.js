const {Schema, model} = require('mongoose');

const UsuarioSchema = Schema({  
    nombre: {type: String, required: [true, 'El nombre es obligatorio']}, 
    apellido: {type: String, required: [true, 'El apellido es obligatorio']},
    correo: {type: String, required: [true, 'El correo es obligatorio'], unique: true},
    password: {type: String, required: [true, 'La contraseña es obligatoria']},
    rol: {type: String, required: true},
    img: {type: String},
    telefono: { type: String },
    domicilio: { type: String },
    ciudad: { type: String },   
    codpostal: { type: String }, 
    fechaRegistro: {type: Date, default: Date.now},
    estado: {type: Boolean, default: true}
});

UsuarioSchema.methods.toJSON = function() {
    // Sacamos la versión (__v) y la contraseña (password) para no mostrarlas
    const { __v, password, _id, ...usuario } = this.toObject();
    
    // Convertimos _id a uid (es más estándar en el frontend)
    usuario.uid = _id;
    
    return usuario;
}

module.exports = model('Usuario', UsuarioSchema);