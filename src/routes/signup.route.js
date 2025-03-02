const express = require('express');
const router = express.Router();
const User = require('../models/users.model');
const bcrypt = require('bcryptjs');

// Registrar un nuevo usuario - POST
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, passwordRepeat } = req.body;

  // Verificar que todos los campos estén completos
  if (!firstName || !lastName || !email || !password || !passwordRepeat) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  // Verificar que las contraseñas coincidan
  if (password !== passwordRepeat) {
    return res.status(400).json({ message: 'Las contraseñas no coinciden' });
  }

  // Verificar si el email ya está registrado
  const userExist = await User.findOne({ email });
  if (userExist) {
    return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
  }

  // Crear el nuevo usuario
  const user = new User({ firstName, lastName, email, password, passwordRepeat });

  try {
    // Cifrar la contraseña
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Guardar el usuario en la base de datos
    const newUser = await user.save();
    res.status(201).json({
      message: 'Usuario creado con éxito',
      user: { id: newUser._id, email: newUser.email }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
