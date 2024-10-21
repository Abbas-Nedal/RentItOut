// routes/logisticRoutes.js
const express = require('express');
const router = express.Router();
const logisticController = require('../controllers/logisticController');

router.post('/', logisticController.createLogistic);
router.put('/:rental_id', logisticController.updateLogistic);
router.delete('/:rental_id', logisticController.deleteLogistic);
router.get('/:rental_id', logisticController.getLogisticsByRental);

module.exports = router;

 // to test http://localhost:3000/logistics/