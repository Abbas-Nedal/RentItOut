const db = require('../database');

exports.getPendingRentalById = async (rentalId) => {
    const [rental] = await db.query(
        `SELECT * FROM rentals WHERE id = ? AND status = 'pending'`,
        [rentalId]
    );
    return rental;
};

exports.insertPaymentTransaction = async (rentalId, amount, paymentMethod) => {
    const result = await db.query(
        `INSERT INTO payment_transactions (rental_id, amount, payment_date, payment_method, status) VALUES (?, ?, NOW(), ?, 'pending')`,
        [rentalId, amount, paymentMethod]
    );
    return result.insertId;
};

exports.getPendingPaymentById = async (paymentId, rentalId) => {
    const [payment] = await db.query(
        `SELECT * FROM payment_transactions WHERE id = ? AND rental_id = ? AND status = 'pending'`,
        [paymentId, rentalId]
    );
    return payment;
};

exports.updatePaymentStatus = async (paymentId, status) => {
    return await db.query(
        `UPDATE payment_transactions SET status = ? WHERE id = ?`,
        [status, paymentId]
    );
};

exports.updateRentalStatus = async (rentalId, paid) => {
    return await db.query(
        `UPDATE rentals SET paid = ? WHERE id = ?`,
        [paid, rentalId]
    );
};

exports.getCancelledRentalById = async (rentalId) => {
    const [rental] = await db.query(
        `SELECT * FROM rentals WHERE id = ? AND status = 'cancelled'`,
        [rentalId]
    );
    return rental;
};

exports.refundPaymentTransaction = async (paymentId, rentalId) => {
    return await db.query(
        `UPDATE payment_transactions SET status = 'refunded' WHERE id = ? AND rental_id = ? AND status = 'paid'`,
        [paymentId, rentalId]
    );
};
exports.getAllPaymentsForUser = async (userID) => {
    return await db.query(
        `SELECT p.* 
         FROM payment_transactions AS p
         JOIN rentals AS r ON p.rental_id = r.id
         WHERE r.user_id = ?`,
        [userID]
    );
};
exports.getPaymentDetailsById = async (rentalId, paymentId) => {
    const [payment] = await db.query(
        `SELECT * FROM payment_transactions WHERE rental_id = ? AND id = ?`,
        [rentalId, paymentId]
    );
    return payment;
};
exports.getAllPayments = async () => {
    return await db.query(`SELECT * FROM payment_transactions`);
};
// exports.getAllPaymentsForRental = async (rentalId) => {
//     return await db.query(
//         `SELECT * FROM payment_transactions WHERE rental_id = ?`,
//         [rentalId]
//     );
// };
