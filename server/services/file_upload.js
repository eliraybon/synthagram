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

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || 
    file.mimetype === 'image/png' || 
    file.mimetype === 'image/gif') {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({
  fileFilter,
  storage: multerS3({
    s3,
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