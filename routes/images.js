const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');

/* GET users listing. */
router.get('/:image', async (req, res) => {

  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });

  const params = { Bucket: 'bloomapi', Key: req.params.image };
  s3.getObject(params, function(err, data) {
    res.writeHead(200, {'Content-Type': 'image/jpg'});
    res.write(data.Body, 'binary');
    res.end(null, 'binary');
  });
});

module.exports = router;
