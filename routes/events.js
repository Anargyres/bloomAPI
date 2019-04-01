const express = require('express');
const router = express.Router();

const Event = require('../models/Event');

// Get list of events

router.get('/', (req, res) => {
  Event.find((err, events) => {
    res.send(events)
  });
});

// Put event

router.put('/', (req, res) => {
  
  const event = Event({
    title: req.body.title,
    description: req.body.description,
    coord: {
      longitude: req.body.longitude,
      latitude: req.body.latitude
    },
    image: req.body.image,
    promotionalCode: req.body.promotionalCode
  });

  event.save((result) => {
    res.send(result);
  });
});

// Remove event

router.delete('/', (req,res) => {
  const idEvent = req.body.idEvent;
  Event.deleteOne({ _id: idEvent }, (err) => {
    if(err){
      console.log(err);
      res.status(500);
    }
    res.status(200);
  })
});



module.exports = router;
