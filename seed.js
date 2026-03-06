const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const Producto = require('./models/Producto');
const UsuarioAdmin = require('./models/UsuarioAdmin');

const productos = [
  // Pastas
  { nombre: 'Sorrentinos de Jamón y Queso', informacion: '', categoria: 'pastas', precio: 1800, stock: 10, infoNutricional: { cal: 480, prot: 22, carb: 58, grasas: 16 } },
  { nombre: 'Panzottis de Espinaca y Muzzarella', informacion: '', categoria: 'pastas', precio: 1700, stock: 10, infoNutricional: { cal: 420, prot: 18, carb: 52, grasas: 14 } },
  { nombre: 'Panzottis de Calabacín y Muzzarella', informacion: '', categoria: 'pastas', precio: 1700, stock: 10, infoNutricional: { cal: 390, prot: 15, carb: 50, grasas: 12 } },
  { nombre: 'Panzottis de Espinaca y Carne', informacion: '', categoria: 'pastas', precio: 1900, stock: 10, infoNutricional: { cal: 460, prot: 26, carb: 50, grasas: 15 } },
  { nombre: 'Lasagna', informacion: '', categoria: 'pastas', precio: 1600, stock: 10, infoNutricional: { cal: 520, prot: 28, carb: 55, grasas: 20 } },
  { nombre: 'Canelones', informacion: '', categoria: 'pastas', precio: 1600, stock: 10, infoNutricional: { cal: 490, prot: 24, carb: 52, grasas: 18 } },
  { nombre: 'Ñoquis', informacion: '', categoria: 'pastas', precio: 1400, stock: 10, infoNutricional: { cal: 380, prot: 12, carb: 62, grasas: 8 } },
  // Pizzas
  { nombre: 'Muzzarella', informacion: 'jamón cocido, masa casera y aceitunas verdes (8 u). Envasada al vacío por unidad', categoria: 'pizzas', precio: 1500, stock: 10, infoNutricional: { cal: 640, prot: 30, carb: 70, grasas: 26 } },
  { nombre: 'Muzzarella', informacion: 'masa casera y aceitunas verdes (8 u). Envasada al vacío por unidad', categoria: 'pizzas', precio: 1300, stock: 10, infoNutricional: { cal: 580, prot: 24, carb: 68, grasas: 22 } },
  { nombre: 'Calabresa', informacion: 'Muzzarella, cantimpalo, masa casera y aceitunas negras (8 u). Envasada al vacío por unidad', categoria: 'pizzas', precio: 1400, stock: 10, infoNutricional: { cal: 620, prot: 26, carb: 66, grasas: 28 } },
  { nombre: 'Provolone', informacion: 'Muzzarella, queso provolone, masa casera y aceitunas negras (8 u). Envasada al vacío por unidad', categoria: 'pizzas', precio: 1450, stock: 10, infoNutricional: { cal: 650, prot: 28, carb: 64, grasas: 30 } },
  { nombre: '4 Quesos', informacion: 'Muzzarella, queso sardo, queso fontina, queso roquefort, masa casera y aceitunas negras (8 u). Envasada al vacío por unidad', categoria: 'pizzas', precio: 1550, stock: 10, infoNutricional: { cal: 710, prot: 32, carb: 65, grasas: 35 } },
  { nombre: 'Roquefort', informacion: 'Muzzarella, queso roquefort, masa casera y aceitunas negras (8 u). Envasada al vacío por unidad', categoria: 'pizzas', precio: 1500, stock: 10, infoNutricional: { cal: 680, prot: 28, carb: 64, grasas: 33 } },
  // Tartas
  { nombre: 'Jamón y Queso', informacion: '', categoria: 'tartas', precio: 1200, stock: 10, infoNutricional: { cal: 440, prot: 20, carb: 38, grasas: 22 } },
  { nombre: 'Pollo', informacion: '', categoria: 'tartas', precio: 1300, stock: 10, infoNutricional: { cal: 420, prot: 24, carb: 36, grasas: 18 } },
  { nombre: 'Espinaca', informacion: '', categoria: 'tartas', precio: 1100, stock: 10, infoNutricional: { cal: 360, prot: 14, carb: 35, grasas: 17 } },
  { nombre: 'Calabacín', informacion: '', categoria: 'tartas', precio: 1100, stock: 10, infoNutricional: { cal: 340, prot: 12, carb: 34, grasas: 16 } },
];

const seed = async () => {
  await Producto.deleteMany({});
  await Producto.insertMany(productos);

  const hashedPass = await bcrypt.hash(process.env.ADMIN_PASS, 10);
  await UsuarioAdmin.deleteMany({});
  await UsuarioAdmin.create({ usuario: process.env.ADMIN_USER, contraseña: hashedPass });

  console.log('Base de datos poblada');
  process.exit();
};

seed();