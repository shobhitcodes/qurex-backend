const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const bookingController = require('../controllers/bookingController');
const { auth } = require('../middlewares/auth');

// routes

// crud
// router.get('/', doctorController.getAll);
// router.post('/', doctorController.create);
router.get('/:id', doctorController.getBookingById);
router.get('/getByUserId/:id', doctorController.getBookingByUserId);
router.put('/:id', bookingController.update);
router.put('/cancel/:id', bookingController.cancel);
// router.delete('/:id', doctorController.deleteOne);
// router.get('/availableSlots/:id', doctorController.availableSlots);
// router.get('/bookings/:id', doctorController.getBookings);

module.exports = router;
