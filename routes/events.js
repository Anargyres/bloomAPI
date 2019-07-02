const express = require('express');
const formidable = require('formidable');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const router = express.Router();

const Event = require('../models/Event');
const TicketBought = require('../models/TicketBought');

// Get list of events

router.get('/', verifyToken, (req, res) => {
  if(req.token) {
    jwt.verify(req.token, process.env.JWT_KEY || "x", (err, authData) => {

      Event.find({idManager: authData.managerID}, (err, events) => {
        res.status(200).send(events);
      });
    });
  }
  else {
    Event.find((err, events) => {
      res.status(200).send(events);
    });
  }
});

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

// Put event

router.post('/', verifyToken, (req, res) => {

  jwt.verify(req.token, process.env.JWT_KEY || "x", (err, authData) => {
    if (err) {
      res.status(403).json({
        error: "Please reconnect"
      });
    }
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.log(err);
        res.status(500);
      }
      const path = files.fileset.path;
      const newPath = './public/images/events/' + files.fileset.name;
      fs.rename(path, newPath, (error) => {
        const event = Event({
          title: fields.title,
          description: fields.description,
          longitude: fields.longitude,
          latitude: fields.latitude,
          image: files.fileset.name,
          promotionalCode: fields.promotionalCode,
          idManager: authData.managerID
        });
        event.save((err, result) => {
          res.status(200).send({id: result.id});
        });
      });
    });
  });
});

router.post('/update/:title', (req, res) => {

  const form = new formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {

    const path = files.fileset.path;
    const newPath = './public/images/events/' + files.fileset.name;
    fs.rename(path, newPath, (error) => {
      const event = Event({
        title: fields.title,
        description: fields.description,
        longitude: fields.longitude,
        latitude: fields.latitude,
        image: files.fileset.name,
        promotionalCode: fields.promotionalCode
      });

      event.update((err, result) => {
        res.status(200).send(result);
      });
    });
  });
});

router.post('/addDate', (req, res) => {
  console.log(req.body)
  console.log(req.body.date)
  Event.update({ idEvent: req.body.idEvent }, { dateEvent: req.body.date }, (err, eventUpdated) => {
    if (err) {
      console.log(err)
    }
    res.status(200).send(eventUpdated);
  });
});

// Remove event

router.delete('/', (req,res) => {
  const titleEvent = req.body.title;
  Event.deleteOne({ title: titleEvent }, (err) => {
    if(err){
      console.log(err);
      res.status(500);
    }
    res.status(200);
  })
});

function verifyToken(req, res, next) {
  if (req.headers["x-access-token"]) {
    req.token = req.headers["x-access-token"];
  }
  next();
}

module.exports = router;
