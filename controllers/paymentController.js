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
    //validate
        if (!rentalId || !amount || !paymentMethod ) {
            return res.status(400).json({ error: "All required fields must be provided" });
        }
        const [rental] = await db.query(`SELECT * FROM rentals WHERE id = ? AND status = 'pending'`, [rentalId]);
        if (!rental) {
            return res.status(404).json({ error: "Rental not found or completed" });
        }
    //process
       // TODO: Handle meny PaymentsForRental logic
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
exports.processPayment = async (req, res) => { //TODO: consider payment type in processing
    try {
        const { rentalId, paymentId } = req.params;
    //validate
        if (!rentalId || !paymentId ) {
            return res.status(400).json({ error: "All required fields must be provided" });
        }
        const [payment] = await db.query(
            `SELECT * FROM payment_transactions WHERE id = ? AND rental_id = ? AND status = 'pending'`,
            [paymentId, rentalId]
        );
        if (!payment) {
            return res.status(404).json({ error: "Payment not found or processed" });
        }
    //process
        const paymentSuccess = true;
        // firstly, it may ambigous, but acttuly i supposed if there a real pay so here we should call real paymnet
        // like PayPal, Visa ....., so it may be failed if no money
        if (paymentSuccess) {
            await db.query(
                `UPDATE payment_transactions SET status = 'paid' WHERE id = ?`,
                [paymentId]
            );
            await db.query(
                `UPDATE rentals SET status = 'completed' WHERE id = ?`,
                [rentalId]
            );
            res.json({ message: "Payment processed successfully" });
        } else {
            res.status(400).json({ error: "Payment failed" });
        }
    } catch (error) {
        if (debug)  console.error("Error  in paymentController/processPayment:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.processRefund = async (req, res) => {
    try {
        const { rentalId, paymentId } = req.params;
    // validate
        if (!rentalId || !paymentId ) {
            return res.status(400).json({ error: "All required fields must be provided" });
        }
        const [rental] = await db.query(`SELECT * FROM rentals WHERE id = ? AND status = 'cancelled'`, [rentalId]);
        if (!rental) {
            return res.status(404).json({ error: "Rental not eligible for refund" });
        }
    //process
        const result = await db.query(
            `UPDATE payment_transactions SET status = 'refunded' WHERE id = ? AND rental_id = ? AND status = 'paid'`,
            [paymentId, rentalId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Payment not found or already refunded" });
        }
        res.json({ message: "Refund processed successfully" });
    } catch (error) {
        console.error("Error in paymentController/processRefund:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.viewAllPaymentForUsers = async (req, res) => {
    try {
        // validate
        if (!rentalId || !userID ) {
            return res.status(400).json({ error: "All required fields must be provided" });
        }
        //process
        // TODO: Handle meny PaymentsForRental logic
        //const allPayments = await db.query(`SELECT * FROM payment_transactions WHERE `);
        if (allPayments.length === 0) {
            return res.status(404).json({ error: "No payments found" });
        }

        res.json({ payments: allPayments });
    } catch (error) {
        console.error("Error payment/allPayments:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }

};

exports.viewPaymentDetails = async (req, res) => {
    try {
        const { rentalId, paymentId } = req.params;
    // validate
        if (!rentalId || !paymentId ) {
            return res.status(400).json({ error: "All required fields must be provided" });
        }
    //process
        const [payment] = await db.query(
            `SELECT * FROM payment_transactions WHERE rental_id = ? AND id = ?`,
            [rentalId, paymentId]
        );
        if (!payment) {
            return res.status(404).json({ error: "Payment not found" });
        }
        res.json({ payment });
    } catch (error) {
        console.error("Error in paymentController/viewingPaymentDetails:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.viewAllPaymentsForRental = async (req, res) => {
    try {
        const { rentalId } = req.params;
    // validate
        if (!rentalId  ) {
            return res.status(400).json({ error: "All required fields must be provided" });
        }
    //process
        const payments = await db.query(
            `SELECT * FROM payment_transactions WHERE rental_id = ?`,
            [rentalId]
        );

        if (payments.length === 0) {
            return res.status(404).json({ error: "No payments found for this rental" });
        }

        res.json({ payments });
    } catch (error) {
        console.error("Error paymentController/viewAllPaymentsForRental:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }

};
exports.viewAllPayments = async (req, res) => { //TODO : Admin valdiation
    try {
    // validate
        if (!rentalId  ) {
            return res.status(400).json({ error: "All required fields must be provided" });
        }
    //process
        const allPayments = await db.query(`SELECT * FROM payment_transactions`);
        if (allPayments.length === 0) {
            return res.status(404).json({ error: "No payments found" });
        }

        res.json({ payments: allPayments });
    } catch (error) {
        console.error("Error payment/allPayments:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }

};
