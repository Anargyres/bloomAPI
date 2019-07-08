const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  idEvent: String,
  name: String,
  price: String,
  quantity: String,
  quantityUpdated: String,
  isUsed: Boolean,
}, { timestamps: {} });


module.exports = mongoose.model('Ticket', ticketSchema)
