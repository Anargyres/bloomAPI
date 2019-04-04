const express = require('express');
const formidable = require('formidable');
const fs = require('fs');

const router = express.Router();

const Event = require('../models/Event');

// Get list of events

router.get('/', (req, res) => {
  Event.find((err, events) => {
    res.send(events)
  });
});

// Put event

router.post('/', (req, res) => {

  const form = new formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {

    if(err) throw err;

    const path = files.fileset.path;
    const newPath = './public/images/events/' + files.fileset.name;
    fs.rename(path, newPath, (error) => {
      const event = Event({
        title: fields.title,
        description: fields.description,
        coord: {
          longitude: fields.longitude,
          latitude: fields.latitude
        },
        image: files.fileset.name,
        promotionalCode: fields.promotionalCode
      });

      event.save((result) => {
        res.send('Event successfully saved');
      });
    });
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
