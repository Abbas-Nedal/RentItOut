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
    return result[0].insertId;
};
exports.getPendingPaymentById = async (paymentId, rentalId) => {
    const [payment] = await db.query(
        `SELECT * FROM payment_transactions WHERE id = ? AND rental_id = ? AND status = 'pending'`,
        [paymentId, rentalId]
    );
    return payment;
};
exports.updatePaymentStatus = async (paymentId, status) => {
     await db.query(
        `UPDATE payment_transactions SET status = ? WHERE id = ?`,
        [status, paymentId]
    );
};
exports.updateRentalStatus = async (rentalId, paid) => {
    await db.query(
        `UPDATE rentals SET status = ? WHERE id = ?`,
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
exports.refundPaymentTransaction = async (paymentId, rentalId, cashback) => {
    return  db.query(
        `UPDATE payment_transactions SET status = 'refunded', amount = ? WHERE id = ?`,
        [cashback, paymentId]
    );
};


exports.getAllPaymentsForUser = async (userID) => {
    const [results] = await db.query(
        `SELECT p.* 
         FROM payment_transactions AS p
         JOIN rentals AS r ON p.rental_id = r.id
         WHERE r.user_id = ?`,
        [userID]
    );
    return results;
};
exports.getAllPayments = async () => {
    return await db.query(`SELECT * FROM payment_transactions`);
};

exports.getPaymentDetailsById = async (rentalId, paymentId) => {
    const [payment] = await db.query(
        `SELECT * FROM payment_transactions WHERE rental_id = ?`,
        [rentalId]
    );
    return payment;
};
// exports.getAllPaymentsForRental = async (rentalId) => {
//     return await db.query(
//         `SELECT * FROM payment_transactions WHERE rental_id = ?`,
//         [rentalId]
//     );
// };