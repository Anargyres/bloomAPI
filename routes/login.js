const express = require('express');
const jwt = require("jsonwebtoken");
const router = express.Router();

const Manager = require('../models/Manager');

router.post('/', (req, res) => {

  const manager = {
    email: req.body.email,
    password: req.body.password
  };


  Manager.findOne(
    {
      email: manager.email
    },
    (err, manager) => {
      if (err) {
        res.status(500).send("Erreur interne");
      }
      if (!manager) {
        res.status(403).send({
          error: "User undefined",
          token: undefined
        });
      }
      if (manager.authenticate(req.body.password, manager.password)) {
        jwt.sign(
          { managerID: manager._id },
          process.env.JWT_KEY || "x",
          { expiresIn: "20min" },
          (err, token) => {
            res.status(200).json({
              error: undefined,
              token: token
            });
          }
        );
      } else {
        res.status(403).json({
          error: "Wrong credentials"
        });
      }
    }
  );


});


module.exports = router;
