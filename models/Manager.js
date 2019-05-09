const mongoose = require('mongoose');
const passwordHash = require('password-hash');
const jwt = require('jwt-simple');

const managerSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true,
    required: true
  },
  password: String,
}, { timestamps: {} });


managerSchema.methods = {
  authenticate: (passwordToVerify, passwordHashed) => {
    return passwordHash.verify(passwordToVerify, passwordHashed);
  },
  getToken: () => {
    return jwt.encode(this, process.env.JWT_KEY || "x");
  }
};

module.exports = mongoose.model('Manager', managerSchema)