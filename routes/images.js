const express = require('express');
const fs = require('fs');
const router = express.Router();

/* GET users listing. */
router.get('/:image', (req, res) => {
  const img = fs.readFileSync(__dirname + '/' + req.params.image);
  res.writeHead(200, {'Content-Type': 'image/jpg' });
  res.end(img, 'binary');
});

module.exports = router;
