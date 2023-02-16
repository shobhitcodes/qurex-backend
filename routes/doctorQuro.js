const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');

const drQuroController = require('../drQuro/doctorQuroController')


router.get('/init', drQuroController.getInit);
router.get('/getIssuesByGender/:gender', drQuroController.getIssuesByGender);
router.get('/getInitNode/:issueName', drQuroController.getInitNode);
router.get('/getChildrenByNode/:nodeId', drQuroController.getChildrenByNode);
router.post('/startConversation',auth, drQuroController.startConversation);
router.get('/getConversationById/:id',auth, drQuroController.getConversationById);
router.post('/addToConversation/:id',auth, drQuroController.addToConversation);
router.post('/updateConversation/:id',auth, drQuroController.updateConversation);
router.get('/generateConversationResult/:id',auth, drQuroController.generateConversationResult);
module.exports = router;

