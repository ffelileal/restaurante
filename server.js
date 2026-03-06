const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Servir archivos estáticos AQUÍ (después de JSON, antes de endpoints)
app.use(express.static(__dirname));

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error conectando a MongoDB:', err));

// Modelos
const Producto = require('./models/Producto');
const Pedido = require('./models/Pedido');
const UsuarioAdmin = require('./models/UsuarioAdmin');

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Acceso denegado' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });
    req.user = user;
    next();
  });
};

// Rutas
app.post('/login', async (req, res) => {
  const { usuario, contraseña } = req.body;
  const admin = await UsuarioAdmin.findOne({ usuario });
  if (!admin || !await bcrypt.compare(contraseña, admin.contraseña)) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }
  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
  res.json({ token });
});

app.get('/productos', async (req, res) => {
  const productos = await Producto.find();
  res.json(productos);
});

app.put('/producto/stock/:id', authenticateToken, async (req, res) => {
  const { stock } = req.body;
  await Producto.findByIdAndUpdate(req.params.id, { stock });
  res.json({ message: 'Stock actualizado' });
});

// Actualizar precio de producto
app.put('/producto/:id', authenticateToken, async (req, res) => {
  const { precio } = req.body;
  await Producto.findByIdAndUpdate(req.params.id, { precio });
  res.json({ message: 'Precio actualizado' });
});

app.get('/pedidos', authenticateToken, async (req, res) => {
  const pedidos = await Pedido.find();
  res.json(pedidos);
});

app.post('/pedido', async (req, res) => {
  const pedido = new Pedido(req.body);
  await pedido.save();
  // Actualizar stock
  for (const prod of pedido.productos) {
    await Producto.findOneAndUpdate({ id: prod.id }, { $inc: { stock: -prod.qty } });
  }
  res.json({ message: 'Pedido guardado' });
});

// Actualizar estado de pedido
app.put('/pedido/:id', authenticateToken, async (req, res) => {
  const { estado } = req.body;
  await Pedido.findByIdAndUpdate(req.params.id, { estado });
  res.json({ message: 'Estado actualizado' });
});

// Eliminar pedido
app.delete('/pedido/:id', authenticateToken, async (req, res) => {
  await Pedido.findByIdAndDelete(req.params.id);
  res.json({ message: 'Pedido eliminado' });
});

app.get('/estadisticas', authenticateToken, async (req, res) => {
  // Lógica para estadísticas
  const pedidos = await Pedido.find();
  // Calcular pedidos por día, etc.
  res.json({ /* datos */ });
});

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});