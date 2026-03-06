const mongoose = require('mongoose');

const UsuarioAdminSchema = new mongoose.Schema({
  usuario: String,
  contraseña: String
});

module.exports = mongoose.model('UsuarioAdmin', UsuarioAdminSchema);