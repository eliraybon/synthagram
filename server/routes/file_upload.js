const express = require("express");
const router = express.Router();

const upload = require('../services/file_upload');

const singleUpload = upload.single('photo')

router.post('/upload', (req, res) => {
  singleUpload(req, res, err => {
    if (err) {
      return res.status(422).send({ 
        errors: [{title: 'Upload Error', detail: err.message }]
      });
    }

    return res.json({ 'photoUrl': req.file.location });
  });
});

module.exports = router;