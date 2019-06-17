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

// Get list of tickets depending on userID

router.get('/user/:userId', (req, res) => {
  TicketBought.find({ userId: req.params.userId }, async (err, tickets) => {
    const ticketBought = tickets.map(async (ticket) => {
      return await Event.findOne({ _id: ticket.idEvent }, (err, events) => {
        return events;
      });
    });
    const resolvedTicketBought = await Promise.all(ticketBought);
    res.status(200).send(resolvedTicketBought);
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


module.exports = router;