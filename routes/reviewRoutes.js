// reviewRoutes.js
const express = require('express');
const reviewController = require('../controllers/reviewController');
const router = express.Router();

router.post('/', reviewController.addReview);

router.put('/:review_id', reviewController.updateReview);

router.get('/:item_id', reviewController.getReviewsByItem);

router.delete('/:review_id', reviewController.deleteReview);

module.exports = router;
// to test : http://localhost:3000/reviews/