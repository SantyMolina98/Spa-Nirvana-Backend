const {response, request} = require('express');
const Servicio = require('../models/servicio');
const cloudinary = require('cloudinary').v2;

const getServicios = async (req = request, res = response) => {
    const {desde = 0, limite = 100} = req.query;
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


const postServicio = async (req = request, res = response) => {
  const { precio, categoria, descripcion, img, duracion, disponible, destacado, usuario } = req.body;
  const nombreObl = req.body.nombre.toUpperCase();

  const servicioDB = await Servicio.findOne({ nombre: nombreObl });
  if (servicioDB) {
    return res.status(400).json({ msg: `El servicio ${servicioDB.nombre}, ya existe` });
  }

  let imgId = img;
  if (img && !img.startsWith('http')) {
    try {
      const result = await cloudinary.uploader.upload(img);
      imgId = result.secure_url;
    } catch (error) {
      return res.status(500).json({ msg: 'Error al subir la imagen' });
    }
  }

  const data = {
    nombre: nombreObl,
    categoria,
    precio,
    descripcion,
    img: imgId,
    duracion,
    disponible,
    destacado,
    usuario: req.usuario._id
  };

  const servicio = new Servicio(data);
  await servicio.save();
  res.status(201).json({ msg: `Servicio ${servicio.nombre}, creado exitosamente`, servicio });
};

  const putServicio = async (req = request, res = response) => {
    const { id } = req.params;
    const { precio, categoria, descripcion, img, duracion, disponible, destacado } = req.body;
    
    const usuarioId = req.usuario._id;

    let imgId;
    if (img) {
      const servicioActual = await Servicio.findById(id);
      const imagenBorrar = servicioActual?.imagen;
      if (imagenBorrar) {
        const nombreArr = imagenBorrar.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.');
        await cloudinary.uploader.destroy(public_id);
      }

      const imagen = async (img) => {
        try {
          const result = await cloudinary.uploader.upload(img);
          return result.secure_url;
        } catch (error) {
          console.error('Error al subir la imagen a Cloudinary:', error);
        }
      };
      imgId = await imagen(img);
    }

    let data = { precio, categoria, descripcion, duracion, disponible, destacado, usuario: usuarioId,img: imgId };
    

    if (req.body.nombre) {
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

