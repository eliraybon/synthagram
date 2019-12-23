const express = require("express");
const router = express.Router();

const upload = require('../services/file_upload');

const singleUpload = upload.single('photo')

router.post('/upload', (req, res) => {
  singleUpload(req, res, err => {
    return res.json({ 'photoUrl': req.file.location });
  });
});

module.exports = router;