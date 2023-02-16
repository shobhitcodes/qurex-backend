const express = require('express');
const router = express.Router();

const fileUploadController = require('../controllers/fileUploadController');

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/result', (req, res) => {
    res.render('result');
});

router.get(
    '/fileUploader/:fileName',
    fileUploadController.getFileUploadSignedUrl
);

module.exports = router;
