const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { auth } = require('../middlewares/auth');

// routes
router.post('/register', doctorController.register);
router.post('/bookAppointment', doctorController.bookAppointment);
router.post('/getBookingsByDate', doctorController.getBookingsByDate);
router.post(
    '/getBookingsByFromAndToTime',
    doctorController.getBookingsByFromAndToTime
);
router.post(
    '/updateAppointmentStatus',
    doctorController.updateAppointmentStatus
);
router.get('/unverified', doctorController.getUnverified);
router.put('/verify/:id', doctorController.verify);

// crud
router.get('/', doctorController.getAll);
router.post('/', doctorController.create);
router.get('/getAllDocForHomePage', doctorController.getAllDocForHomePage)
router.get('/:id', doctorController.getById);
router.get('/getByUserId/:id', doctorController.getByUserId);
router.put('/:id', doctorController.update);
router.put('/updateByUserId/:id', doctorController.updateByUserId);
router.delete('/:id', doctorController.deleteOne);
router.get('/availableSlots/:id', doctorController.availableSlots);
router.get('/bookings/:id', doctorController.getBookings);
router.get('/praticeDashDetails/:id', doctorController.dashDetails);

module.exports = router;


// doctor/getByUserId/:id