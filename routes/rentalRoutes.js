const express = require("express");
const router = express.Router();
const rentalControllers = require('../controllers/rentalController')

router.post('/', rentalControllers.createRental);
router.get('/admin', rentalControllers.viewAllRentals);
router.get('/admin/revenews', rentalControllers.viewAllRentals);
router.get('/user/:userId', rentalControllers.viewRentalHistory);
router.put('/:rentalId/complete', rentalControllers.completeRental);
router.put('/:rentalId/extend', rentalControllers.extendRental);
router.put('/:rentalId/cancel', rentalControllers.cancelRental);
router.get('/:rentalId', rentalControllers.viewRentalDetails);
module.exports = router;

/**?
 *  POST /api/v1/rentals
 *  PUT  /api/v1/rentals/{rentalId}/complete
 *  PUT  /api/v1/rentals/{rentalId}/extend
 *  PUT  /api/v1/rentals/{rentalId}/cancel
 *  GET  /api/v1/rentals/{rentalId}
 *  GET  /api/v1/rentals/user/{userId}
 *  GET  /api/v1/rentals/admin
 */