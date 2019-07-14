const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
  accessKeyId: 'AKIAIRUGBF5EIC3XBC2A',
  secretAccessKey: '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'
});
/* GET users listing. */
router.get('/:image', async (req, res) => {

  async function getObject (bucket, objectKey) {
    try {
      const params = {
        Bucket: 'bloomapi',
        Key: req.params.image
      }

      const data = await s3.getObject(params).promise();

      return data.Body.toString('utf-8');
    } catch (e) {
      throw new Error(`Could not retrieve file from S3: ${e.message}`)
    }
  }

  const image = await getObject();
  res.writeHead(200, {'Content-Type': 'image/jpg'});
  res.write(image, 'binary');
  res.end(null, 'binary');


});

module.exports = router;
