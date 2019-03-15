const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  coord: {
    longitude: String,
    latitude: String
  },
  image: String,
  promotionalCode: String,
  date: Date
  //  @todo ID MANAGER
  // @todo PRIX
});


module.exports = mongoose.model('Event', eventSchema)