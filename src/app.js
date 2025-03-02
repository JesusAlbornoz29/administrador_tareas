const express = require('express');
const mongoose = require('mongoose');
const { config } = require('dotenv'); 
config();

// Importar las rutas
const signupRoutes = require('./routes/signup.route'); 
const loginRoutes = require('./routes/login.route');   

const app = express(); 

// Middleware para procesar JSON
app.use(express.json()); 

// Verificar variables de entorno
if (!process.env.MONGO_URL || !process.env.MONGO_DB_NAME) {
  console.error('❌ ERROR: Variables de entorno faltantes.');
  process.exit(1);
}

// Conexión a MongoDB con manejo de errores
mongoose.connect(process.env.MONGO_URL, { dbName: process.env.MONGO_DB_NAME })
  .then(() => console.log('✅ Conectado a la base de datos'))
  .catch(err => {
    console.error('❌ Error al conectar con la base de datos:', err);
    process.exit(1);
  });

// Rutas
app.use('/api/auth/signup', signupRoutes); // Rutas de registro 
app.use('/api/auth/login', loginRoutes);    // Rutas de inicio de sesión

// Puerto de la aplicación
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${port}`);
});
