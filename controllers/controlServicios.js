const {response, request} = require('express');
const Servicio = require('../models/servicio');
const Categoria = require('../models/categoria');
const cloudinary = require('cloudinary').v2;

const getServicios = async (req = request, res = response) => {
    const {desde = 0, limite = 0} = req.query;
    const query = { disponible: true };

    const [total, servicios] = await Promise.all([
        Servicio.countDocuments(query),
        Servicio.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate('usuario','correo')
            .populate('categoria', 'nombre')
    ]);

    res.json({
        mensaje: 'Servicios obtenidos correctamente',
        total,
        servicios
    });
  }

const getServicioID = async(req = request, res = response) => {
    const { id } = req.params;
    const servicio = await Servicio.findById(id)
        .populate('usuario','nombre')
        .populate('categoria', 'nombre');

        res.json({
        mensaje: 'Servicio obtenido por ID correctamente',
        servicio
    });
}     


const postServicio = async(req = request, res = response) => { 
    const { precio, descripcion, img, duracion, disponible,/* usuario */ } = req.body; 
    const nombreObl = req.body.nombre.toUpperCase();

    //Verificar  y validar si la categoría existe
    const categoriaValid = req.body.categoria.toUpperCase();
    const categoriaDB = await Categoria.findOne({ nombre: categoriaValid });

    if(!categoriaDB){
      return res.status(400).json({
        msg: `La categoría ${categoriaValid} no existe`
      });
    }

    //Verificar si el servicio existe
    const servicioDB = await Servicio.findOne({ nombreObl });
     
    //Validar si el producto existe
    if(servicioDB){
      return res.status(400).json({
        msg: `El servicio ${servicioDB.nombreObl}, ya existe`
      });
    }
    
    //Subir imagen a Cloudinary
    const result = await cloudinary.uploader.upload(img );
    const imagen = result.secure_url;   

    //Generar la data a guardar
    const data = {nombre: nombreObl, categoria: categoriaDB._id, precio, descripcion, img: imagen, duracion, disponible /* , usuario: req.usuario._id */ };

    const servicio = new Servicio(data);

    //Grabar en la DB
    await servicio.save();
    res.status(201).json({
      msg: `Servicio ${servicio.nombre}, creado exitosamente`,
      servicio
    })
  }

  const putServicio = async (req = request, res = response) => {
    const { id } = req.params;
    const { precio, categoria, descripcion, img, duracion, disponible, /* usuario */ } = req.body;
    
    /* const usuario = req.usuario_id; */

    if(img){
      const servicioActual = await Servicio.findById(id);
      const imagenBorrar = servicioActual.img;
      const nombreArr = imagenBorrar.split('/');
      const nombre = nombreArr[nombreArr.length - 1];
      const [public_id] = nombre.split('.');

      //Borrar imagen de Cloudinary
      await cloudinary.uploader.destroy(public_id);
    }

    //Carga de la imagen nueva
    const resultPut = await cloudinary.uploader.upload(img);
    const imagenPut = resultPut.secure_url;

    let data = {precio,categoria, descripcion, img: imagenPut,duracion, disponible}

    if(req.body.nombre){
      data.nombre = req.body.nombre.toUpperCase();
    }

    const servicioPut = await Servicio.findByIdAndUpdate(id, data, { new: true });
    res.json({
      mensaje: 'Servicio actualizado correctamente',
      servicioPut
    });
  }

  const deleteServicio = async(req = request, res = response) => {
    const { id } = req.params;

    //Borrado inactivo
    const servicioBorrado = await Servicio.findByIdAndUpdate(id, { disponible: false }, { new: true });

    res.json({
      mensaje: 'Servicio eliminado correctamente',
      servicioBorrado
    });
  }


module.exports = {
    getServicios,
    getServicioID,
    postServicio,
    putServicio,
    deleteServicio
};


//Me quedé en la clase 74, tengo que comenzarla