const express = require('express');
const Jwt = require('jsonwebtoken');

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

// JWT
const JWT_SECRET = process.env.JWT_SECRET;
module.exports = { JWT_SECRET };
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
module.exports = { JWT_EXPIRES_IN };

// Verificar token middleware
const verificar = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ status: false, errors: ['No token provided.'] });
  }
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
    Jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ status: false, errors: ['Failed to authenticate token.'] });
      }
      req.decoded = decoded;
      next();
    });
  } else {
    return res.status(401).json({ status: false, errors: ['Invalid token format.'] });
  }
};

module.exports = { verificar };


// Conexión a MongoDB con manejo de errores
mongoose.connect(process.env.MONGO_URL, { dbName: process.env.MONGO_DB_NAME })
  .then(() => console.log('✅ Conectado a la base de datos'))
  .catch(err => {
    console.error('❌ Error al conectar con la base de datos:', err);
    process.exit(1);
  });

// Rutas
app.use('/api/auth/signup', signupRoutes); // Rutas de registro 
app.use('/api/auth', loginRoutes);    // Rutas de inicio de sesión

// Puerto de la aplicación
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${port}`);
});
