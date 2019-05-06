const mongoose = require('mongoose');

const managerSchema = new mongoose.Schema({
  email: String,
  password: String,
}, { timestamps: {} });


module.exports = mongoose.model('Manager', managerSchema)