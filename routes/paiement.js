const express = require('express');
const braintree = require('braintree');

const TicketBought = require('../models/TicketBought');
const Ticket = require('../models/Ticket');
const PromotionalCode = require('../models/PromotionalCode');

const router = express.Router();

router.post('/ticket', (req, res) => {
  Ticket.findOne({ _id: req.body.ticket._id }, (err, ticket) => {
    if(ticket.quantity > 0){
      const ticketBought = new TicketBought({
        idEvent: req.body.ticket.idEvent,
        userId: req.body.userId,
        ticketId: req.body.ticket._id,
        price: req.body.ticket.price,
        isUsed: false
      });
      ticketBought.save((err) => {
        if (err) {
          console.log(err);
          res.status(500);
        }
        Ticket.update({ _id: req.body.ticket._id }, { $inc: { quantityUpdated : -1 }}, (err, ticket) => {
          if(err){
            console.log(err)
            res.status(500);
          }
        });

        PromotionalCode.update({ idEvent: req.body.ticket.idEvent }, { $inc: { quantity : -1 }}, (err, promotionalCode) => {
          if(err){
            console.log(err)
            res.status(500);
          }
        });
      });
    }
  });
});


module.exports = router;
