const {Schema, model} = require('mongoose');

const UsuarioSchema = Schema({  
    nombre: {type: String, required: [true, 'El nombre es obligatorio']}, 
    apellido: {type: String, required: [true, 'El apellido es obligatorio']},
    username: {type: String, required: [true, 'El nombre de usuario es obligatorio'], unique: true},
    correo: {type: String, required: [true, 'El correo es obligatorio'], unique: true},
    password: {type: String, required: [true, 'La contraseña es obligatoria']},
    rol: {type: String,required: [true, 'El rol es obligatorio'], enum: ['Admin', 'Usuario', 'Profesional']},
    especialidadCategoria: {
        type: [Schema.Types.ObjectId],
        ref: 'Categoria',
        required: function () {
            return this.rol === 'Profesional';
        },
        validate: {
            validator: function (value) {
                return this.rol !== 'Profesional' || (Array.isArray(value) && value.length > 0);
            },
            message: 'La especialidad de categoria es obligatoria para profesionales'
        }
    },
    especialidadServicio: {
        type: [Schema.Types.ObjectId],
        ref: 'Servicio',
        required: function () {
            return this.rol === 'Profesional';
        },
        validate: {
            validator: function (value) {
                return this.rol !== 'Profesional' || (Array.isArray(value) && value.length > 0);
            },
            message: 'La especialidad de servicio es obligatoria para profesionales'
        }
    },
    agenda: {
        type: [
            {
                servicio: { type: Schema.Types.ObjectId, ref: 'Servicio', required: true },
                dia: { type: String, enum: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'], required: true },
                horarios: { type: [String], required: true }
            }
        ],
        required: function () {
            return this.rol === 'Profesional';
        },
        validate: [
            {
                validator: function (value) {
                    return this.rol !== 'Profesional' || (Array.isArray(value) && value.length > 0);
                },
                message: 'La agenda es obligatoria para profesionales'
            },
            {
                validator: function (value) {
                    if (this.rol !== 'Profesional') {
                        return true;
                    }
                    if (!Array.isArray(value)) {
                        return false;
                    }
                    const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
                    const slots = new Set();
                    for (const item of value) {
                        if (!item || !Array.isArray(item.horarios) || item.horarios.length === 0) {
                            return false;
                        }
                        for (const horario of item.horarios) {
                            if (!timeRegex.test(horario)) {
                                return false;
                            }
                            const slotKey = `${item.dia}|${horario}`;
                            if (slots.has(slotKey)) {
                                return false;
                            }
                            slots.add(slotKey);
                        }
                    }
                    return true;
                },
                message: 'La agenda tiene horarios invalidos o repetidos'
            }
        ]
    },
    img: {type: String},
    telefono: { type: String },
    domicilio: { type: String, required: [true, 'El domicilio es obligatorio'] },
    ciudad: {
        type: String,
        required: [true, 'La ciudad es obligatoria'],
        enum: [
            'Buenos Aires', 'Ciudad Autonoma de Buenos Aires','Catamarca','Chaco','Chubut','Cordoba','Corrientes','Entre Rios',
            'Formosa','Jujuy','La Pampa','La Rioja','Mendoza','Misiones','Neuquen','Rio Negro','Salta','San Juan','San Luis','Santa Cruz',
            'Santa Fe','Santiago del Estero','Tierra del Fuego','Tucuman'
        ]
    },   
    codpostal: { type: Number }, 
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