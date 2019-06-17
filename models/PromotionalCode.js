const mongoose = require('mongoose');

const promotionalCode = new mongoose.Schema({
  idEvent: String,
  name: String,
  price: Number,
  quantity: Number,
}, { timestamps: {} });


module.exports = mongoose.model('PromotionalCode', promotionalCode)