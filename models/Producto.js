const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
  nombre: String,
  informacion: String,
  categoria: String,
  precio: Number,
  stock: Number,
  infoNutricional: {
    cal: Number,
    prot: Number,
    carb: Number,
    grasas: Number
  }
});

module.exports = mongoose.model('Producto', ProductoSchema);