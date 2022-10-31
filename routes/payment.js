const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// routes

// router.get('/createOrder', paymentController.createOrder);
router.get('/getAllPayments', paymentController.getAllPayments);
router.get('/getAllFailedPayments', paymentController.getAllFailedPayments);
router.get('/getAllPatientPayments/:patientId', paymentController.getAllPatientPayments);
router.get('/getAllPaymentForDoctor/:doctorId', paymentController.getAllPaymentForDoctor);

router.get('/verifySuccessfulPayment', paymentController.verifySuccessfulPayment);
router.get('/logPaymentError', paymentController.logPaymentError);

module.exports = router;
