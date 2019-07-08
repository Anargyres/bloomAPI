const mongoose = require('mongoose');

const Event = require('../models/Event');


const resumeEventSchema = new mongoose.Schema({
}, { timestamps: {} });


module.exports = mongoose.model('eventSchema', resumeEventSchema)
