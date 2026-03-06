const mongoose = require('mongoose');
const Producto = require('../models/Producto');

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGO_URI);
};

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Método no permitido' });

  await connectDB();
  const productos = await Producto.find();
  res.status(200).json(productos);
}