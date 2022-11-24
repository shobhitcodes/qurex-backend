const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');

const drQuroController = require('../drQuro/doctorQuroController')


router.get('/init', drQuroController.getInit);
router.get('/getIssuesByGender/:gender', drQuroController.getIssuesByGender);
router.get('/getInitNode/:issueName', drQuroController.getInitNode);
router.get('/getChildrenByNode/:nodeId', drQuroController.getChildrenByNode);
router.post('/startConversation', drQuroController.startConversation);
router.get('/getConversationById/:id', drQuroController.getConversationById);
router.post('/addToConversation/:id', drQuroController.addToConversation);
router.get('/generateConversationResult/:id', drQuroController.generateConversationResult);
module.exports = router;

