const Usuario = require('../models/usuario');
const Rol = require('../models/rol');
const Categoria = require('../models/categoria');
const Servicio = require('../models/servicio');

//Validar email
const esemailValido = async (correo ) => {
  const existeEmail = await Usuario.findOne({ correo });
  if (existeEmail) {
    throw new Error(`El correo: ${correo}, ya está registrado`);
  }

}

//Validar rol
const esRolValido = async (rol) => {
  const existeRol = await Rol.findOne({ rol });
  if (!existeRol) {
    throw new Error(`El rol: ${rol}, no está registrado en la BD`);
  }
}

//Validar usuario por ID
const esUsuarioValido = async (id) => {
  const existeUsuario = await Usuario.findById(id);
  if (!existeUsuario) {
    throw new Error(`El usuario con id: ${id}, no existe`);
  }
}

//Validar categoria
const esCategoriaValida = async (id) => {
  const existeCategoria = await Categoria.findById(id);
  if (!existeCategoria) {
    throw new Error(`La categoría de ID: ${id}, no existe`);
  }
}

//Validar servicio
const esServicioValido = async (id) => {
  const existeServicio = await Servicio.findById(id);
  if (!existeServicio) {
    throw new Error(`El servicio con id: ${id}, no existe`);
  }
}

module.exports = {
  esemailValido,
  esRolValido,
  esCategoriaValida,
  esServicioValido
}