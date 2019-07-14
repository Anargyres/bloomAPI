const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
  accessKeyId: 'AKIAJ2ATLZDU45UJ3ZRA',
  secretAccessKey: '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'
});
/* GET users listing. */
router.get('/:image', async (req, res) => {

  const response = await s3.listObjectsV2({
    Bucket: 'bloomapi'
  }).promise();

  console.log(response);

  var params = { Bucket: 'bloomapi', Key: req.params.image };
  console.log(req.params.image)
  s3.getObject(params, function(err, data) {
    res.writeHead(200, {'Content-Type': 'image/jpg'});
    res.write(data.Body, 'binary');
    res.end(null, 'binary');
  });
});

module.exports = router;
