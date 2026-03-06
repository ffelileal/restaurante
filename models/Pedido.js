const mongoose = require('mongoose');

const PedidoSchema = new mongoose.Schema({
  cliente: {
    nombre: String,
    telefono: String,
    direccion: String
  },
  productos: [{
    id: String,
    nombre: String,
    precio: Number,
    qty: Number
  }],
  total: Number,
  pago: String,
  fechaPedido: { type: Date, default: Date.now },
  fechaEntrega: Date,
  estado: { type: String, default: 'pendiente' }
});

module.exports = mongoose.model('Pedido', PedidoSchema);