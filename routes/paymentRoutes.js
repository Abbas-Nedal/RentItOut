const express = require("express");
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/:rentalId/pay', paymentController.initializePayment);
router.post('/:rentalId/payments/:paymentId/process', paymentController.processPayment);
router.post('/:rentalId/payments/:paymentId/refund', paymentController.processRefund);

router.get('/:rentalId/payments/:paymentId', paymentController.viewPaymentDetails);
router.get('/:rentalId/payments', paymentController.viewAllPaymentsForRental);
router.get('/admin/payments', paymentController.viewAllPayments);
router.get('/user/:userId/payments', paymentController.viewAllPaymentForUsers);

module.exports = router;
