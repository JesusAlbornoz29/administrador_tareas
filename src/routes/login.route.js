const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/users.model');
const { verificar } = require('../app');


// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Verificar que los campos estén presentes
  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
  }

  try {
    // Buscar al usuario en la base de datos
    const user = await User.findOne({ email });
    console.log('Usuario encontrado:', user); // Verifica si el usuario fue encontrado

    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // Usar el método comparePassword del modelo
    const isMatch = await user.comparePassword(password);
    console.log('Contraseña ingresada:', user.password);
    console.log('Contraseña en la base de datos:', user.password);
    console.log('Contraseña coincide:', isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // Verificar que el JWT_SECRET esté definido en el entorno
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('❌ ERROR: JWT_SECRET no está definido en el entorno.');
      return res.status(500).json({ message: 'Error interno del servidor. JWT_SECRET no está definido.' });
    }

    // Generar el JWT
    const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '1h' });

    // Responder con el token
    console.log('Token generado:', token); // Verificar que se genera un token
    res.json({ message: 'Login exitoso', token, userEmail: user.email });
  } catch (error) {
    console.error('Error en el login:', error); // Manejo de errores
    res.status(500).json({ message: 'Error en el servidor' });
  }
});


module.exports = router;
