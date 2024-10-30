/*
* author : abdalsalam
* this code define the controllers for paymnests endpoints
*
* payment_transactions table :
*   id
*   amount
*   payment_date
*   payment_method
*   rental_id
*   status
* */
const debug = true;


exports.initializePayment = async (req, res) => {
    try {
        const { rentalId } = req.params;
        const { amount, paymentMethod } = req.body;

        const [rental] = await db.query(`SELECT * FROM rentals WHERE id = ? AND status = 'pending'`, [rentalId]);
        if (!rental) {
            return res.status(404).json({ error: "Rental not found or already completed." });
        }

        const result = await db.query(
            `INSERT INTO payment_transactions (rental_id, amount, payment_date, payment_method, status) VALUES (?, ?, NOW(), ?, 'pending')`,
            [rentalId, amount, paymentMethod]
        );

        res.status(201).json({ message: "Payment initialized", paymentId: result.insertId });
    } catch (error) {
        if (debug) console.error("Error in paymentController/initializePayment:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.processPayment = async (req, res) => {

};


exports.viewPaymentDetails = async (req, res) => {

};
exports.processRefund = async (req, res) => {

};
exports.viewAllPaymentsForRental = async (req, res) => {

};
exports.viewAllPayments = async (req, res) => {

};
