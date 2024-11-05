const db = require('../config/database');

exports.createRental = async (rentalData) => {
    const {
        user_id,
        item_id,
        quantity,
        start_date,
        end_date,
        insurance_fee,
        platform_fee,
        total_price
    } = rentalData;
    const query = `
        INSERT INTO rentals (user_id, item_id, quantity, start_date, end_date, created_at, insurance_fee, platform_fee, total_price, status,amount_paid)
        VALUES (?, ?, ?, ?, ?, NOW(), ?, ?, ?, 'pending',0);
    `;
    const [result] = await db.query(query, [
        user_id, item_id, quantity, start_date, end_date,
        insurance_fee, platform_fee, total_price
    ]);
    return result.insertId;
};
exports.decreaseAvailableQuantity = async (itemId, decrementAmount) => {
    try {
        const [result] = await db.query(
            `UPDATE items SET available_quantity = available_quantity - ? WHERE id = ? AND available_quantity >= ?`,
            [decrementAmount, itemId, decrementAmount]
        );

        if (result.affectedRows === 0) {
            throw new Error("Insufficient available quantity or item not found");
        }

        return { message: "Available quantity decreased successfully" };
    } catch (error) {
        console.error("Error decreasing available quantity:", error);
        throw new Error("Failed to decrease available quantity");
    }
};
exports.increaseAvailableQuantity = async (itemId, incrementAmount) => {
    try {
        const [result] = await db.query(
            `UPDATE items SET available_quantity = available_quantity + ? WHERE id = ? `,
            [incrementAmount, itemId]
        );
        console.error("result ",result);

        if (result.affectedRows === 0) {
            throw new Error("Insufficient available quantity or item not found");
        }

        return { message: "Available quantity increased successfully" };
    } catch (error) {
        console.error("Error increasing available quantity:", error);
        throw new Error("Failed to increase available quantity");
    }
};
exports.completeRental = async (rentalId) => {
    const query = `
        UPDATE rentals
        SET status = 'completed', completed_at = NOW()
        WHERE id = ? ;
    `;
    const [result] = await db.query(query, [rentalId]);
    return result;
};
exports.cancelRental = async (rentalId) => {
    const query = `
        UPDATE rentals
        SET status = 'cancelled'
        WHERE id = ? AND status != 'completed';
    `;
    const [result] = await db.query(query, [rentalId]);
    return result.affectedRows;
};
exports.extendRental = async (rentalId, newEndDate) => {
    const query = `
        UPDATE rentals
        SET end_date = ?
        WHERE id = ? ;
    `;
    const [result] = await db.query(query, [newEndDate, rentalId]);
    return result.affectedRows;
};

exports.getRentalDetails = async (rentalId) => {
    const query = `
        SELECT * FROM rentals WHERE id = ?;
    `;
    const [rows] = await db.query(query, [rentalId]);
    return rows[0];
};
exports.getUserRentalHistory = async (userId, status) => {
    let query = `SELECT * FROM rentals WHERE user_id = ?`;
    const params = [userId];
    if (status) {
        query += ` AND status = ?`;
        params.push(status);
    }
    const [rows] = await db.query(query, params);
    return rows;
};
exports.getAllRentals = async () => {
    const query = `SELECT * FROM rentals`;
    const [rows] = await db.query(query);
    return rows;
};

exports. fetchItem = async (item_id)=> {
    const [item] = await db.query(
        `SELECT * FROM items WHERE id = ?`,
        [item_id]
    );
    return item;
}
exports.getPaymentDetailsById = async (rentalId, paymentId) => {
    const [payment] = await db.query(
        `SELECT * FROM payment_transactions WHERE rental_id = ?`,
        [rentalId]
    );
    return payment[0];
};