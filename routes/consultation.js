const express = require('express');
const router = express.Router();
const consultationController = require('../controllers/consultationController');
const { auth } = require('../middlewares/auth');

// routes
router.get('/', auth, consultationController.getAll);
router.post('/', auth, consultationController.create);
router.get('/:id', auth, consultationController.getById);
router.get('/getByUserId/:id', auth, consultationController.getByUserId);
router.put('/:id', auth, doctorController.update);
router.delete('/:id', auth, consultationController.deleteOne);

module.exports = router;
