const express = require('express');
const jwt = require('jsonwebtoken');
const passwordHash = require('password-hash');

const router = express.Router();

const Manager = require('../models/Manager');

// Get list of events

router.get('/', verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.JWT_KEY || "x", (err, authData) => {
    Manager.findOne({ _id: authData.managerID}, (err, manager) => {
      res.status(200).json({ manager });
    });
  });
});

router.post('/:id', (req, res) => {

  Manager.update(
    { _id: req.params.id },
    { email: req.body.email,
      password: passwordHash.generate(req.body.password),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber
    },
    (err) => {
      if (err) {
        res.status(400).json({
          error: "Error during update"
        });
      } else {
        res.status(200).send("Successfully updated");
      }
    }
  );
});


function verifyToken(req, res, next) {
  if (req.headers["x-access-token"]) {
    req.token = req.headers["x-access-token"];
  }
  next();
}




module.exports = router;
