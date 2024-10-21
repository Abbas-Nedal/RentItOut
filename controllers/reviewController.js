const Review = require('../models/Review');
const Rental = require('../models/Rental');

const sequelize = require('../database');
const moment = require('moment-timezone');
/*
From Abbas

This code is responsible for review information.
The user is not allowed to add more than one review for the same item
 */

exports.addReview = async (req, res) => {
    try {
        const { user_id, item_id, rating, comment } = req.body;

        const rentalExists = await Rental.findOne({
            where: {
                user_id,
                item_id,
                status: 'completed'
            }
        });

        if (!rentalExists) {
            return res.status(400).json({ error: 'User has not rented this item or rental is not completed.' });
        }
      // from Abbas :  check that the user has not previously rated.
        const existingReview = await Review.findOne({
            where: {
                user_id,
                item_id
            }
        });

        if (existingReview) {

            return res.status(400).json({ error: 'User has already reviewed this item.' });
        }

        const newReview = await Review.create({
            user_id,
            item_id,
            rating,
            comment,
            created_at: moment().tz('Asia/Gaza').format()
        });

        res.status(201).json(newReview);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add review.' });
    }
};


exports.updateReview = async (req, res) => {
    try {
        const { review_id } = req.params;
        const { user_id, rating, comment } = req.body;

        const review = await Review.findOne({ where: { id: review_id, user_id } });

        if (!review) {
            return res.status(404).json({ error: 'Review not found or user does not have permission.' });
        }

        review.rating = rating || review.rating;
        review.comment = comment || review.comment;
        review.updated_at =  moment().tz('Asia/Gaza').format()


        await review.save();

        res.status(200).json(review);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update review.' });
    }
};

exports.getReviewsByItem = async (req, res) => {
    try {
        const { item_id } = req.params;

        const reviews = await Review.findAll({
            where: { item_id }
        });

        const reviewStats = await Review.findOne({
            where: { item_id },
            attributes: [
                [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'reviewCount']
            ]
        });

        if (!reviewStats) {
            return res.status(404).json({ error: 'No reviews found for this item.' });
        }

        res.status(200).json({
            reviews,
            averageRating: parseFloat(reviewStats.dataValues.averageRating),
            reviewCount: parseInt(reviewStats.dataValues.reviewCount)
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch reviews.' });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const { review_id } = req.params;

        const review = await Review.findByPk(review_id);
        if (!review) {
            return res.status(404).json({ error: 'Review not found.' });
        }

        await review.destroy();
        res.status(200).json({ message: 'Review deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete review.' });
    }
};
