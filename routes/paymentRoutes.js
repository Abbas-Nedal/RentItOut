const express = require("express");
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/rentals/:rentalId/payments', paymentController.initializePayment);
router.get('/rentals/:rentalId/payments/:paymentId', paymentController.viewPaymentDetails);
router.post('/rentals/:rentalId/payments/:paymentId/refund', paymentController.processRefund);
router.get('/rentals/:rentalId/payments', paymentController.viewAllPaymentsForRental);
router.get('/admin/payments', paymentController.viewAllPayments);

module.exports = router;
