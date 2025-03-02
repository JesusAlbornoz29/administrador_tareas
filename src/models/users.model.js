const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Para cifrar las contraseñas

// Definición del esquema de usuario
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,  // El nombre es obligatorio
    },
    lastName: {
      type: String,
      required: true,  // El apellido es obligatorio
    },
    email: {
      type: String,
      required: true,  // El email es obligatorio
      unique: true,    // El email debe ser único
      match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,  // Validación básica de email
    },
    password: {
      type: String,
      required: true,  // La contraseña es obligatoria
    },
    passwordRepeat: {
      type: String,
      required: true,  // La repetición de contraseña es obligatoria
    },
  },
  { timestamps: true } // Agrega campos `createdAt` y `updatedAt`
);

// Middleware para cifrar la contraseña antes de guardar el usuario
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Si no se modifica la contraseña, salta la encriptación
  this.password = await bcrypt.hash(this.password, 10); // Hash de la contraseña con un salt de 10 rondas
  next();
});

// Método para comparar la contraseña ingresada con la almacenada en la base de datos
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Exportar el modelo de usuario
module.exports = mongoose.model('User', userSchema);
