const db = require('../database');
// From abbas

/* This code is responsible for the delivery information.
 Make sure here that it will not be able to add more
  than one delivery for the same order (it doesn't make sense at all)
 */

exports.createLogistic = async (req, res) => {
    try {
        const { rental_id, pickup_location, delivery_option } = req.body;

        const delivery_fee = delivery_option === 'delivery' ? 20 : 0;

        const rental = await db.query(
            `SELECT id FROM rentals WHERE id = ?`, [rental_id]
        );

        if (rental[0].length === 0) {
            return res.status(404).json({ error: 'Rental not found.' });
        }

        const existingLogistic = await db.query(
            `SELECT id FROM logistics WHERE rental_id = ?`, [rental_id]
        );

        if (existingLogistic[0].length > 0) {
            return res.status(400).json({ error: 'Logistic information already exists for this rental.' });
        }

        await db.query(
            `INSERT INTO logistics (rental_id, pickup_location, delivery_option, delivery_fee, created_at)
             VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
            [rental_id, pickup_location, delivery_option, delivery_fee]
        );

        res.status(201).json({ message: 'Logistic created successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create logistic information.' });
    }
};

exports.updateLogistic = async (req, res) => {
    try {
        const { rental_id } = req.params;
        const { pickup_location, delivery_option } = req.body;

        const logistic = await db.query(
            `SELECT * FROM logistics WHERE rental_id = ?`, [rental_id]
        );

        if (logistic[0].length === 0) {
            return res.status(404).json({ error: 'Logistic not found for this rental.' });
        }

        const delivery_fee = delivery_option === 'delivery' ? 20 : 0;

        await db.query(
            `UPDATE logistics SET pickup_location = ?, delivery_option = ?, delivery_fee = ?, created_at = CURRENT_TIMESTAMP
             WHERE rental_id = ?`,
            [
                pickup_location || logistic[0][0].pickup_location,
                delivery_option || logistic[0][0].delivery_option,
                delivery_fee,
                rental_id
            ]
        );

        res.status(200).json({ message: 'Logistic updated successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update logistic information.' });
    }
};

exports.deleteLogistic = async (req, res) => {
    try {
        const { rental_id } = req.params;

        const logistic = await db.query(
            `SELECT * FROM logistics WHERE rental_id = ?`, [rental_id]
        );

        if (logistic[0].length === 0) {
            return res.status(404).json({ error: 'Logistic not found for this rental.' });
        }

        await db.query(`DELETE FROM logistics WHERE rental_id = ?`, [rental_id]);

        res.status(200).json({ message: 'Logistic deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete logistic information.' });
    }
};



exports.getLogisticsByRental = async (req, res) => {
    try {
        const { rental_id } = req.params;

        if (!rental_id) {
            return res.status(400).json({ error: 'Rental ID is required.' });
        }

        const logistics = await db.query(
            `SELECT * FROM logistics WHERE rental_id = ?`, [rental_id]
        );

        if (logistics[0].length === 0) {
            return res.status(404).json({ error: 'No logistics found for this rental.' });
        }

        res.status(200).json(logistics[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch logistics.' });
    }
};
exports.getAllLogistics = async (req, res) => {
    try {
        const logistics = await db.query(`SELECT * FROM logistics`);

        if (logistics[0].length === 0) {
            return res.status(404).json({ error: 'No logistics found.' });
        }

        const result = logistics[0].map(({ id, ...rest }) => rest);

        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch logistics.' });
    }
};


