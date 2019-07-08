const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  idEvent: String,
  name: String,
  price: Number,
  quantity: Number,
  quantityUpdated: Number,
  isUsed: Boolean,
}, { timestamps: {} });


module.exports = mongoose.model('Ticket', ticketSchema)
