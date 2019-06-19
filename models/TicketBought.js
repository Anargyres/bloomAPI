const mongoose = require('mongoose');

const ticketBoughtSchema = new mongoose.Schema({
  idEvent: String,
  userId: String,
  ticketId: String,
  price: String,
  isUsed: false,
}, { timestamps: {} });

module.exports = mongoose.model('TicketBought', ticketBoughtSchema)