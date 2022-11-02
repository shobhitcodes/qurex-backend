const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { auth } = require('../middlewares/auth');

// routes

// crud
// router.get('/', doctorController.getAll);
// router.post('/', doctorController.create);
router.get('/:id', doctorController.getBookingById);
// router.get('/getByUserId/:id', doctorController.getByUserId);
// router.put('/:id', doctorController.update);
// router.delete('/:id', doctorController.deleteOne);
// router.get('/availableSlots/:id', doctorController.availableSlots);
// router.get('/bookings/:id', doctorController.getBookings);

module.exports = router;
