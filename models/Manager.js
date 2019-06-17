const mongoose = require('mongoose');
const passwordHash = require('password-hash');

const managerSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true,
    required: true
  },
  password: String,
  firstName: String,
  lastName: String,
  phoneNumber: String,
}, { timestamps: {} });


managerSchema.methods = {
  authenticate: (passwordToVerify, passwordHashed) => {
    return passwordHash.verify(passwordToVerify, passwordHashed);
  }
};

module.exports = mongoose.model('Manager', managerSchema)