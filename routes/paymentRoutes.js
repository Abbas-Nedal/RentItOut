const express = require("express");
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/:rentalId/pay', paymentController.initializePayment);
router.put('/:rentalId/payments/:paymentId/process', paymentController.processPayment);
router.put('/:rentalId/payments/:paymentId/refund', paymentController.processRefund);
router.get('/:rentalId/payments', paymentController.viewPaymentDetails);
router.get('/admin/payments', paymentController.viewAllPayments);
router.get('/admin/revenues', paymentController.viewRevenues);
router.get('/user/:userId/payments', paymentController.viewAllPaymentForUsers);
// router.get('/:rentalId/payments', paymentController.viewAllPaymentsForRental);
module.exports = router;
