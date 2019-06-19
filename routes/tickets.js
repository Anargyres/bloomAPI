const express = require('express');
const router = express.Router();

const Event = require('../models/Event');
const Ticket = require('../models/Ticket');
const TicketBought = require('../models/TicketBought');
const PromotionalCode = require('../models/PromotionalCode');

// Get list of tickets depending on eventID

router.get('/:idEvent', (req, res) => {
  Ticket.find({ idEvent: req.params.idEvent }, (err, tickets) => {
    res.send(tickets)
  });
});

router.post('/user/:userId', (req, res) => {
  TicketBought.findOne({ userId: req.params.userId }, async (err, ticket) => {
    res.status(200).send(ticket.findOne({ idEvent: req.body.idEvent }));
  });
});

// Post ticket

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

router.post('/promotionalCode', (req, res) => {

  const promotionalCode = PromotionalCode({
    idEvent: req.body.idEvent,
    name: req.body.name,
    price: req.body.price,
    quantity: req.body.quantity,
  });

  promotionalCode.save((err) => {
    if(err){
      console.log(err);
      res.status(500);
    }
    res.status(200);
  });
});

router.get('/qrcode/:idEvent', (req, res) => {

});


module.exports = router;
