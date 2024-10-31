const express = require("express");
const router = express.Router();
const rentalControllers = require('../controllers/rentalController')

router.post('/rentals', rentalControllers.createRental);
router.put('/rentals/:rentalId/complete', rentalControllers.completeRental);
router.put('/rentals/:rentalId/extend', rentalControllers.extendRental);
router.put('/rentals/:rentalId/cancel', rentalControllers.cancelRental);

router.get('/rentals', rentalControllers.viewRentalHistory);
router.get('/rentals/:rentalId', rentalControllers.viewRentalDetails);
//admin only
router.get('/admin/rentals', rentalControllers.viewAllRentals);

module.exports = router;
