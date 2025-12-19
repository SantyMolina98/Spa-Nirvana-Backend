const { Schema, model } = require('mongoose');

const ReservaSchema = Schema({
  usuario:{type:Schema.Types.ObjectId, ref:'Usuario' ,required:['El usuario es obligatorio para una reserva', true]},
  servicio: {type:Schema.Types.ObjectId, ref:'Servicio', required:['El servicio es obligatorio seleccionarlo', true]},
  fechaReserva:{type:Date, required:['Es obligatorio seleccionar una fecha para una reserva', true]},
  horaReserva:{type: String, required:['Es obligatorio seleccionar una hora para una reserva', true]},
  estado:{type:String, enum:['pendiente', 'confirmada', 'cancelada'], default:'pendiente'},
  fechaCreacion:{type:Date, default:Date.now}
});

module.exports = model('Reserva', ReservaSchema);