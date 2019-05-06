const express = require('express');

const router = express.Router();

const Event = require('../models/Event');
const Ticket = require('../models/Ticket');

// Get list of events

router.get('/', (req, res) => {
  Event.find((err, events) => {
    res.send(events)
  });
});

// Put event

router.post('/', (req, res) => {

  const ticket = Ticket({
    idEvent: req.body.idEvent,
    name: req.body.name,
    price: req.body.price,
    quantity: req.body.quantity,
    isUsed: false
  });

  ticket.save((err) => {
    if(err){
      console.log(err);
      res.status(500);
    }
    res.status(200);
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
