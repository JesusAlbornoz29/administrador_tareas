const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { config } = require('dotenv'); // Importamos la funcion config de dotenv que sirve para cargar las variables de entorno
config();

// Importar las rutas
const signupRoutes = require('./routes/signup.route'); // Ruta para registro de usuarios
const loginRoutes = require('./routes/login.route');   // Ruta para login de usuarios

const app = express(); // Crear una instancia de express

// Middleware: bodyparser - Parseador de Bodies
app.use(bodyParser.json()); 

// Conexión a la base de datos MongoDB
mongoose.connect(process.env.MONGO_URL, { dbName: process.env.MONGO_DB_NAME })
  .then(() => console.log('Conectado a la base de datos'))
  .catch(err => console.log('Error al conectar con la base de datos', err));

// Rutas
app.use('/api/auth', signupRoutes);  // Ruta para registro de usuarios
app.use('/api/auth', loginRoutes);   // Ruta para login de usuarios

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
