const express = require('express');
const router = express.Router();

const PromotionalCode = require('../models/PromotionalCode');

// Verify promotionalCode

router.post('/:idEvent', (req, res) => {
  PromotionalCode.find({ idEvent: req.params.idEvent }, (err, promotionalCode) => {
    if(req.body.string === promotionalCode[0].name){
      console.log(promotionalCode[0])
      res.status(200).send(promotionalCode[0]);
    }
  });
});

module.exports = router;
