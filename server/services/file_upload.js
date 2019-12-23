const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const secretAccessKey = require('../../config/keys').awsSecretAccessKey;
const accessKey = require('../../config/keys').awsAccessKey;

aws.config.update({
  secretAccessKey: secretAccessKey,
  accessKeyId: accessKey,
  region: 'us-east-1'
});

const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'synthagram',
    // acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})

module.exports = upload;