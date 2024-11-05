
const db = require('../database');

/*
From Abbas

This code is responsible for review information.
The user is not allowed to add more than one review for the same item
 */

exports.addReview = async (req, res) => {
    try {
        const { user_id, item_id, rating, comment } = req.body;


        const rentalExists = await db.query(
            `SELECT id FROM rentals WHERE user_id = ? AND item_id = ? AND status = 'completed'`,
            [user_id, item_id]
        );

        if (rentalExists[0].length === 0) {
            return res.status(400).json({ error: 'User has not rented this item or rental is not completed.' });
        }


        const existingReview = await db.query(
            `SELECT id FROM reviews WHERE user_id = ? AND item_id = ?`,
            [user_id, item_id]
        );

        if (existingReview[0].length > 0) {
            return res.status(400).json({ error: 'User has already reviewed this item.' });
        }


        await db.query(
            `INSERT INTO reviews (user_id, item_id, rating, comment, created_at) 
            VALUES (?, ?, ?, ?, NOW())`,
            [user_id, item_id, rating, comment]
        );

        res.status(201).json({ message: 'Review added successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add review.' });
    }
};
exports.updateReview = async (req, res) => {
    try {
        const { review_id } = req.params;
        const { rating, comment } = req.body;


        const review = await db.query(
            `SELECT * FROM reviews WHERE id = ?`,
            [review_id]
        );

        // Check if the review exists
        if (review[0].length === 0) {
            return res.status(404).json({ error: 'Review not found.' });
        }

        await db.query(
            `UPDATE reviews SET
                                rating = COALESCE(?, rating),
                                comment = COALESCE(?, comment),
                                created_at = NOW()
             WHERE id = ?`,
            [rating, comment, review_id]
        );

        res.status(200).json({ message: 'Review updated successfully.' });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ error: 'Failed to update review.' });
    }
};

exports.getReviewsByItem = async (req, res) => {
    try {
        const { item_id } = req.params;


        const reviews = await db.query(
            `SELECT * FROM reviews WHERE item_id = ?`, [item_id]
        );


        const reviewStats = await db.query(
            `SELECT AVG(rating) AS averageRating, COUNT(id) AS reviewCount 
            FROM reviews WHERE item_id = ?`, [item_id]
        );

        if (reviewStats[0].length === 0) {
            return res.status(404).json({ error: 'No reviews found for this item.' });
        }

        res.status(200).json({
            reviews: reviews[0],
            averageRating: parseFloat(reviewStats[0][0].averageRating),
            reviewCount: parseInt(reviewStats[0][0].reviewCount)
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch reviews.' });
    }
};
exports.deleteReview = async (req, res) => {
    try {
        const { review_id } = req.params;


        const review = await db.query(
            `SELECT * FROM reviews WHERE id = ?`, [review_id]
        );

        if (review[0].length === 0) {
            return res.status(404).json({ error: 'Review not found.' });
        }


        await db.query(`DELETE FROM reviews WHERE id = ?`, [review_id]);

        res.status(200).json({ message: 'Review deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete review.' });
    }
};

