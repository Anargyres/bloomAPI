const express = require('express');
const router = express.Router();

const Event = require('../models/Event');
const Ticket = require('../models/Ticket');
const TicketBought = require('../models/TicketBought');
const PromotionalCode = require('../models/PromotionalCode');

// Get list of tickets depending on eventID

router.get('/:idEvent', (req, res) => {
  Ticket.find({ idEvent: req.params.idEvent }, (err, tickets) => {
    res.status(200).send(tickets);
  });
});

router.post('/user/:userId', (req, res) => {
  TicketBought.find({ userId: req.params.userId, idEvent: req.body.string }, (err, ticketBought) => {
    Ticket.find({ _id: ticketBought[0].ticketId }, (err, ticket) => {
      res.status(200).send(ticket[0]);
    });
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

router.get('/qrcode/:userId/:ticketId', (req, res) => {
  TicketBought.find({ userId: req.params.userId, ticketId: req.params.ticketId }, (err, ticket) => {
    if(ticket[0].isUsed === false) {
      ticket[0].update({isUsed: true}, (err, ticketUpdated) => {
        if (err) {
          console.log(err)
          res.sendFile(__dirname + '/qrCodeFailure.html');
        }
        res.sendFile(__dirname + '/qrCodeSuccess.html');
      });
    } else {
      res.sendFile(__dirname + '/qrCodeFailure.html');
    }
  });
});


module.exports = router;
