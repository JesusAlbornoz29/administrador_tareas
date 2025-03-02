const express = require('express');
const router = express.Router();
const User = require('../models/users.model');
const bcrypt = require('bcryptjs');

// Registrar un nuevo usuario - POST
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  const userExist = await User.findOne({ email });
  if (userExist) {
    return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
  }

  const user = new User({ firstName, lastName, email, password });

  try {
    // const salt = await bcrypt.genSalt(10);
    // user.password = await bcrypt.hash(password, salt);

    const newUser = await user.save();
    res.status(201).json({
      message: 'Usuario creado con éxito',
      user: { id: newUser._id, email: newUser.email },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Obtener todos los usuarios - GET
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // No enviar contraseñas
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

// Obtener un usuario por ID - GET
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el usuario' });
  }
});

// Actualizar un usuario por ID - PUT
router.put('/users/:id', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si el correo electrónico ya está registrado por otro usuario
    const userExist = await User.findOne({ email });
    if (userExist && userExist._id.toString() !== req.params.id) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado por otro usuario' });
    }

    // Actualizar los campos
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    const updatedUser = await user.save();
    res.status(200).json({
      message: 'Usuario actualizado con éxito',
      user: { id: updatedUser._id, email: updatedUser.email },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Modificar parcialmente un usuario por ID - PATCH
router.patch('/users/:id', async (req, res) => {
  const updates = req.body;

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: 'No se proporcionaron campos para actualizar' });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Si se intenta actualizar la contraseña
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    // Aplicar las actualizaciones
    Object.keys(updates).forEach((key) => {
      user[key] = updates[key];
    });

    const updatedUser = await user.save();
    res.status(200).json({
      message: 'Usuario actualizado parcialmente con éxito',
      user: { id: updatedUser._id, email: updatedUser.email },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Eliminar un usuario por ID - DELETE
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json({ message: 'Usuario eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
});

module.exports = router;
