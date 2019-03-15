const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  type: String,
  price: Number,
  qrcode: String,
  isUsed: Boolean,
  validityDate: Date
});


module.exports = mongoose.model('Ticket', ticketSchema)