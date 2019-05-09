const express = require('express');
const generator = require('generate-password');
const nodeMailer = require('nodemailer');
const passwordHash = require('password-hash');
const jwt = require("jsonwebtoken");

const Manager = require('../models/Manager');


const router = express.Router();

router.post('/', (req, res) => {

  let password = generator.generate({
    length: 8,
    numbers: true
  });

  const manager = Manager({
    email: req.body.email,
    password: passwordHash.generate(password)
  });

  const findManager = new Promise((resolve, reject) => {
    Manager.findOne(
      {
        email: manager.email
      },
      (err, result) => {
        if (err) {
          reject(500);
        }
        if (result) {
          reject(204);
        } else {
          resolve(true);
        }
      }
    );
  });

  findManager.then(
    () => {
      const newManager = new Manager(manager);
      newManager.save((err, user) => {
        if (err) {
          res.status(500).send("Erreur interne");
        }
        jwt.sign(
          { userID: user._id },
          process.env.JWT_KEY || "x" ,
          { expiresIn: "20min" },
          (err, token) => {

            let transporter = nodeMailer.createTransport({
              host: 'smtp.gmail.com',
              port: 465,
              secure: true,
              auth: {
                user: 'tristan.luong@gmail.com',
                pass: 'gNKEyvBT@1075013'
              },
              authentication: 'plain',
              enable_stattls_auto: true
            });
            let mailOptions = {
              from: '"Bloom staff" <xx@gmail.com>', // sender address
              to: req.body.email, // list of receivers
              subject: "Welcome in the Bloom team !", // Subject line
              html: '<div align="center">' +
              '<img src="https://thumbor.forbes.com/thumbor/960x0/https%3A%2F%2Fblogs-images.forbes.com%2Fjessedamiani%2Ffiles%2F2017%2F11%2FScreen-Shot-2017-11-14-at-3.07.49-PM.jpg" width="500px"/>' +
              '<h1>Welcome ! </h1>' +
              '<p>Because you have registered on our manager app, here is your password : </p>' +
              '<b>' + password + '</b>' +
              '</div>' // html body
            };

            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                return console.log(error);
              }
              console.log('Message %s sent: %s', info.messageId, info.response);
            });

            res.status(200).json({
              error: null,
              token: token
            });
          }
        );
      });
    },
    error => {
      switch (error) {
        case 500:
          res.status(500).send(error);
          break;
        case 204:
          res.status(400).json({
            error: "This email is already taken",
            token: undefined
          });
          break;
        default:
          res.status(500).send("Erreur interne");
      }
    }
  );
});


module.exports = router;
