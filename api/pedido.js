const mongoose = require('mongoose');
const Pedido = require('../models/Pedido');
const Producto = require('../models/Producto');

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGO_URI);
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Método no permitido' });

  await connectDB();
  const pedido = new Pedido(req.body);
  await pedido.save();
  // Actualizar stock
  for (const prod of pedido.productos) {
    await Producto.findOneAndUpdate({ nombre: prod.nombre }, { $inc: { stock: -prod.qty } });
  }
  res.status(200).json({ message: 'Pedido guardado' });
}