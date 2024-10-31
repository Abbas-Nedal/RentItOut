const express = require("express");
const router = express.Router();
const rentalControllers = require('../controllers/rentalController')

router.post('/', rentalControllers.createRental);
router.put('/:rentalId/complete', rentalControllers.completeRental);
router.put('/:rentalId/extend', rentalControllers.extendRental);
router.put('/:rentalId/cancel', rentalControllers.cancelRental);
router.get('/:rentalId', rentalControllers.viewRentalDetails);
router.get('/user/rentals', rentalControllers.viewRentalHistory);
router.get('/admin/rentals', rentalControllers.viewAllRentals);
module.exports = router;

/**?
 * http://localhost:3000/rentals/1
 *
 */