const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
  accessKeyId: 'AKIAJY3GD3CC2YLIGHUQ',
  secretAccessKey: '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'
});
/* GET users listing. */
router.get('/:image', async (req, res) => {

});

module.exports = router;
