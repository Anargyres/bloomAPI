const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
  accessKeyId: 'AKIAIRUGBF5EIC3XBC2A',
  secretAccessKey: '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'
});
/* GET users listing. */
router.get('/:image', (req, res) => {

  var params = { Bucket: 'bloomapi', Key: req.params.image };
  console.log(req.params.image)
  s3.getObject(params, function(err, data) {
    console.log(data);
    res.writeHead(200, {'Content-Type': 'image/jpg'});
    res.write(data.Body, 'binary');
    res.end(null, 'binary');
  });
});

module.exports = router;
