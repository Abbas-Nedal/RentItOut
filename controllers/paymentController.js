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
const paymentModel = require('../models/paymentModel');
const { convertCurrency } = require('../services/currencyService');
const cashback_percentage = 0.5
const ERROR_MESSAGES = {
    REQUIRED_FIELDS: "All required fields must be provided",
    RENTAL_NOT_FOUND: "Rental not found or completed",
    PAYMENT_NOT_FOUND: "Payment not found or processed",
    PAYMENT_FAILED: "Payment failed",
    NO_PAYMENTS_FOUND: "No payments found",
    INTERNAL_SERVER_ERROR: "Internal server error"
};
const handleError = (res, statusCode, message) => {
    if (debug) console.error(message);
    res.status(statusCode).json({ error: message });
};
exports.initializePayment = async (req, res) => {
    const { rentalId } = req.params;
    const { amount, paymentMethod , currency } = req.body;

    //validate
    if (!rentalId || !amount || !paymentMethod ||!currency ) {
        return handleError(res, 400, ERROR_MESSAGES.REQUIRED_FIELDS);
    }
    try {
        const rental = await paymentModel.getPendingRentalById(rentalId);
        if (!rental) {
            return handleError(res, 404, ERROR_MESSAGES.RENTAL_NOT_FOUND);
        }
    //External API
        const amountUSD = await convertCurrency(currency,"USD",amount)
        console.log(amountUSD)
        if (!amountUSD) {
            return handleError(res, 404,"Currency conversion failed");
        }
    //process
        const paymentId = await paymentModel.insertPaymentTransaction(rentalId, amountUSD, paymentMethod);
        res.status(201).json({
            message: "Payment initialized",
            paymentId: paymentId,
            redirectTo:`PUT /api/v1/rentals/${rentalId}/payments/${paymentId}/process/`,
            body: {amount:amount, currency:currency}
        });
    } catch (error) {
        if (debug) console.error("Error in paymentController/initializePayment: ", error,"\n", error.message);
        handleError(res, 500,
            debug ? "Error in paymentController/initializePayment: "+error.message
                           : ERROR_MESSAGES.INTERNAL_SERVER_ERROR
        );
    }
};
exports.processPayment = async (req, res) => {
    const { rentalId, paymentId } = req.params;
    const { amount, currency } = req.body;

    //validate
    if (!rentalId || !paymentId ||!currency ) {
        return handleError(res, 400, ERROR_MESSAGES.REQUIRED_FIELDS);
    }
    try {
        const rental = await paymentModel.getPendingRentalById(rentalId);
        if (!rental) {
            return handleError(res, 404, ERROR_MESSAGES.RENTAL_NOT_FOUND);
        }if (amount < rental.total_price || amount > rental.total_price) {
            return handleError(res, 400, `Invalid payment amount. Required: ${rental.total_price}`);
        }
        const payment = await paymentModel.getPendingPaymentById(paymentId, rentalId);
        if (!payment) {
            return handleError(res, 404, ERROR_MESSAGES.PAYMENT_NOT_FOUND);
        }
    //process
        const paymentSuccess = true;
        // firstly, it may ambigous, but acttuly i supposed if there a real pay so here we should call real paymnet
        // like PayPal, Visa ....., so it may be failed if no money
        if (paymentSuccess) {
            await paymentModel.updatePaymentStatus(paymentId, 'paid');
            await paymentModel.updateRentalStatus(rentalId,'paid');
            res.json({
                message: "Payment processed successfully",
                redirectTo: "POST /api/v1/logistics/",
                body:{
                    rentalId:rentalId,
                    pickup_location:"location",
                    delivery_option: "pickup"
                }
            });
        } else {
            handleError(res, 400, ERROR_MESSAGES.PAYMENT_FAILED);
        }
    } catch (error) {
        if (debug)  console.error("Error in paymentController/processPayment:", error,"\n", error.message);
        handleError(res, 500,
            debug ? "Error in paymentController/processPayment: " +error.message
                : ERROR_MESSAGES.INTERNAL_SERVER_ERROR
        );
    }
};
exports.processRefund = async (req, res) => {
    const { rentalId, paymentId } = req.params;
const {status}= req.body;
    // validate
    if (!rentalId || !paymentId  ||!status) {
        return handleError(res, 400, ERROR_MESSAGES.REQUIRED_FIELDS);
    }
    try {
        const rental = await paymentModel.getCancelledRentalById(rentalId);
        if (!rental) {
            return handleError(res, 404, ERROR_MESSAGES.RENTAL_NOT_FOUND);
        }

        let cashback = 0;

        if (status === "pending") {
            cashback = 0;
        } else if (status === "paid") {
            cashback = rental[0].total_price * cashback_percentage;
        }

        //process
        const result = await paymentModel.refundPaymentTransaction(paymentId, rentalId,cashback);
        console.log(paymentId, rentalId,cashback)
        if (result.affectedRows === 0) {
            return handleError(res, 404, "Payment not found or already refunded");
        }
       // const result = await paymentModel.refundPaymentTransaction(paymentId, rentalId);

        res.json({ message: "Refund processed successfully" });
    } catch (error) {
        if (debug)  console.error("Error in paymentController/processRefund:", error, "\n",error.message);
        handleError(res, 500,
            debug ? "Error in paymentController/processRefund:" + error.message
                : ERROR_MESSAGES.INTERNAL_SERVER_ERROR
        );
    }
};
exports.viewAllPaymentForUsers = async (req, res) => {
    const { userId } = req.params;

    // validate
    if (!userId ) {
        return handleError(res, 400, ERROR_MESSAGES.REQUIRED_FIELDS);
    }
    //process
    try {
        const allPayments = await paymentModel.getAllPaymentsForUser(userId);
        if (allPayments.length === 0) {
            return handleError(res, 404, ERROR_MESSAGES.NO_PAYMENTS_FOUND);
        }
        res.json({ payments: allPayments });
    } catch (error) {
        if (debug) console.error("Error payment/allPayments:", error,"\n", error.message);
        handleError(res, 500,
            debug ? "Error in paymentController/viewAllPaymentForUsers: " + error.message
                : ERROR_MESSAGES.INTERNAL_SERVER_ERROR
        );
    }
};
exports.viewPaymentDetails = async (req, res) => {
    const { rentalId } = req.params;

    // validate
    if (!rentalId  ) {
        return handleError(res, 400, ERROR_MESSAGES.REQUIRED_FIELDS);
    }

    //process
    try {
        const payment = await paymentModel.getPaymentDetailsById(rentalId);
        if (!payment) {
            return handleError(res, 404, ERROR_MESSAGES.PAYMENT_NOT_FOUND);
        }
        res.json({ payment });
    } catch (error) {
        if (debug) console.error("Error in paymentController/viewingPaymentDetails:", error,"\n", error.message);
        handleError(res, 500,
            debug ? "Error in paymentController/viewPaymentDetails: " + error.message
                : ERROR_MESSAGES.INTERNAL_SERVER_ERROR
        );
    }
};
exports.viewAllPayments = async (req, res) => {
    //process
    try {
        const allPayments = await paymentModel.getAllPayments();
        if (allPayments.length === 0) {
            return handleError(res, 404, ERROR_MESSAGES.NO_PAYMENTS_FOUND);
        }
        res.json({ payments: allPayments });
    } catch (error) {
        if (debug) console.error("Error payment/allPayments: ", error, "\n",  error.message);
        handleError(res, 500,
            debug ? "Error in paymentController/viewAllPayments: " + error.message
                : ERROR_MESSAGES.INTERNAL_SERVER_ERROR
        );
    }
};
exports.viewRevenues = async (req, res) => {
    try {
        const Revenues = await paymentModel.getRevenues();
        if (!Revenues || Revenues === 0) {
            return handleError(res, 404, ERROR_MESSAGES.NO_PAYMENTS_FOUND);
        }
        res.json({ Revenues: Revenues });
    } catch (error) {
        if (debug ) console.error("Error viewing all Revenues:", error);
        handleError(res, 500, debug ? `Error viewing all Revenues: ${error.message}` : "Internal Server Error");
    }
};

// exports.viewAllPaymentsForRental = async (req, res) => {
//     try {
//         const { rentalId } = req.params;
//         // validate
//         if (!rentalId  ) {
//             return res.status(400).json({ error: "All required fields must be provided" });
//         }
//         //process
//         const payments = await paymentModel.getAllPaymentsForRental(rentalId);
//         if (payments.length === 0) {
//             return res.status(404).json({ error: "No payments found for this rental" });
//         }
//         res.json({ payments });
//     } catch (error) {
//         if (debug) console.error("Error paymentController/viewAllPaymentsForRental:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
//
// };
