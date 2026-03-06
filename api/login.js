const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UsuarioAdmin = require('../models/UsuarioAdmin');

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGO_URI);
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Método no permitido' });

  await connectDB();

  const { usuario, contraseña } = req.body;
  const admin = await UsuarioAdmin.findOne({ usuario });
  if (!admin || !await bcrypt.compare(contraseña, admin.contraseña)) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }
  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
  res.status(200).json({ token });
}