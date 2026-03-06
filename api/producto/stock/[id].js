const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Producto = require('../../../models/Producto');

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGO_URI);
};

const authenticateToken = (req) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) throw new Error('Acceso denegado');
  return jwt.verify(token, process.env.JWT_SECRET);
};

export default async function handler(req, res) {
  if (req.method !== 'PUT') return res.status(405).json({ message: 'Método no permitido' });

  try {
    authenticateToken(req);
    await connectDB();
    const { stock } = req.body;
    await Producto.findByIdAndUpdate(req.query.id, { stock: parseInt(stock) });
    res.status(200).json({ message: 'Stock actualizado' });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
}