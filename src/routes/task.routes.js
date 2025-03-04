// task.routes.js
const express = require('express');
const Jwt = require('jsonwebtoken');
const router = express.Router();
const Task = require('../models/task.model');

// Middleware para verificar el token
const verificar = (req, res, next) => {
    const JWT_SECRET = process.env.JWT_SECRET; // Asegúrate de importar esto si es necesario
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

// Crear una nueva tarea
router.post('/', verificar, async (req, res) => {
    const { title } = req.body;
    const userId = req.decoded.userId;

    const task = new Task({ title, userId });
    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Obtener todas las tareas de un usuario
router.get('/', verificar, async (req, res) => {
    const userId = req.decoded.userId;
    try {
        const tasks = await Task.find({ userId });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;