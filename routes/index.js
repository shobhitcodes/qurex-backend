const express = require('express');
const router = express.Router();

const fileUploadController = require('../controllers/fileUploadController');

router.get('/', (req, res) => {
    res.send('qurex world');
});

router.get(
    '/fileUploader/:fileName',
    fileUploadController.getFileUploadSignedUrl
);

module.exports = router;
