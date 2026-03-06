const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Pedido = require('../models/Pedido');

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
  if (req.method !== 'GET') return res.status(405).json({ message: 'Método no permitido' });

  try {
    authenticateToken(req);
    await connectDB();
    const pedidos = await Pedido.find();
    // Lógica básica de estadísticas
    const pedidosPorDia = {}; // Implementar agrupación por fecha
    const ventasPorDia = {};
    const productosVendidos = {};
    // ... calcular
    res.status(200).json({ pedidosPorDia, ventasPorDia, productosVendidos });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
}