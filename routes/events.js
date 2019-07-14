const express = require('express');
const formidable = require('formidable');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
  accessKeyId: 'AKIAIHZCEIDG76HQBZSQ',
  secretAccessKey: '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'
});
const router = express.Router();

const Event = require('../models/Event');
const TicketBought = require('../models/TicketBought');
const Ticket = require('../models/Ticket');
const PromotionalCode = require('../models/PromotionalCode');

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

// Récupérer les events liés au ticket acheté du client

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

      fs.readFile(path, (err, data) => {
        if (err) throw err;
        const params = {
          Bucket: 'bloomapi', // pass your bucket name
          Key: files.fileset.name, // file will be saved as testBucket/contacts.csv
          Body: JSON.stringify(data, null, 2)
        };
        s3.upload(params, (s3Err, data) => {
          if (s3Err) throw s3Err
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
});

router.post('/update/:title', (req, res) => {

  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    const path = files.fileset.path;
    const newPath = __dirname + '../public/images/events/' + files.fileset.name;
    fs.rename(path, newPath, (error) => {
      Event.update({ title: req.params.title }, {
        title: fields.title,
        description: fields.description,
        longitude: fields.longitude,
        latitude: fields.latitude,
        image: files.fileset.name,
        promotionalCode: fields.promotionalCode
      }, (err, eventUpdated) => {
        if(err){
          console.log(err)
          res.status(500);
        } else {
          res.status(200);
        }
      });
    });
  });
});

// Update the date of event

router.post('/addDate', (req, res) => {
  Event.update({ _id: req.body.idEvent }, { dateEvent: req.body.date }, (err, eventUpdated) => {
    if (err) {
      console.log(err)
    }
    res.status(200).send(eventUpdated);
  });
});

router.post('/friends', async (req, res) => {

  const friends  = req.body.dataDTOList;

  let allFriendsParticipating = [];
  const data = friends.map(async friend => {
    return TicketBought.findOne({ userId: friend.id, idEvent: req.body.idEvent }, async (err, friendParticipating) => {
      if(friendParticipating){
        await allFriendsParticipating.push(friend);
      }
    });
  });

  const resolvedFriendsParticipating = await Promise.all(data);
  console.log(allFriendsParticipating);
  res.status(200).send(allFriendsParticipating);
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
  });
});

// Récupérer l'ensemble des informations concernant les soirées de l'organisateur

router.get('/resume/:eventTitle', (req, res) => {
  Event.findOne({ title: req.params.eventTitle }, (err, event) => {
    if(err){
      console.log(err);
      res.status(500);
    }
    Ticket.find({ idEvent: event. _id}, (err, tickets) => {
      res.status(200).send(tickets);
    });
  });
});

router.get('/promotionalCode/:idEvent', (req, res) => {
  Event.findOne({ _id: req.params.idEvent}, (err, event) => {
    PromotionalCode.findOne({ idEvent: event._id }, (error, promotionalCode) => {
      let totalReduce = (promotionalCode.quantity - promotionalCode.quantityUpdated) * promotionalCode.price;
      console.log(totalReduce)
      res.json({ totalReduce });
    });
  });
});

function verifyToken(req, res, next) {
  if (req.headers["x-access-token"]) {
    req.token = req.headers["x-access-token"];
  }
  next();
}

module.exports = router;
