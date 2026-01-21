const express = require('express');
const cors = require('cors');
const { dbConection } = require('../database/config');

class Server{
  constructor(){
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.authPath = '/api/auth';
    this.usuarioPath = '/api/usuarios';
    this.categoriasPath = '/api/categorias';
    this.serviciosPath = '/api/servicios';
    this.reservasPath = '/api/reservas';

    //Conectar a base de datos
    this.conectarDB();

    //Middlewares
    this.middlewares();

    //Rutas de la página
    this.routes();
  }

  async conectarDB(){
    await dbConection();
  }

  middlewares(){
    //CORS
    this.app.use(cors({
     origin: process.env.NODE_ENV === "production" 
     ? "https://spa-nirvana.netlify.app"
     : "http://localhost:5174",
     credentials: true,
     allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-token"
     ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    }));
   /* this.app.use("*", cors()); */

    //Lectura y parseo del body
    this.app.use(express.json());

    //Definir carpeta pública
    this.app.use(express.static('public'));
  }

  routes(){
    this.app.use(this.authPath, require('../routes/rutaAuth'));
    this.app.use(this.usuarioPath, require('../routes/rutaUsuarios'));
    this.app.use(this.categoriasPath, require('../routes/rutaCategorias'));
    this.app.use(this.serviciosPath, require('../routes/rutaServicio'));
    this.app.use(this.reservasPath, require('../routes/rutaReserva'));
  }
  

  listen(){
    this.app.listen(this.port, () => {
      console.log('Servidor corriendo en puerto', this.port);
    })
  }

}

module.exports = Server;