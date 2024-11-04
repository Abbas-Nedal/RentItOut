/*
* author : abdalsalam
* this code define the controllers for rentals endpoints
*
* rentals table :
*   id
*   amount_paid
*   completed_at
*   created_at
*   end_date
*   insurance_fee
*   item_id
*   platform_fee
*   quantity
*   start_date
*   status
*   total_price
*   user_id
*   paid --> exist in payment
* */
const rentalModel = require("../models/rentalModel");
const paymentModel = require("../models/paymentModel");

const debug = true;
const platform_fee_percentage  = 0.1
const insurance_fee_percentage  = 0.05
const cashback_percentage = 0.5
//TODO: in completeRental u should handle notification and detremine who called this method?????

const ERROR_MESSAGES = {
    REQUIRED_FIELDS: "All required fields must be provided",
    INVALID_RENTAL_ID: "Invalid rental ID",
    RENTAL_NOT_FOUND: "Rental not found",
    ITEM_NOT_FOUND: "Item not found",
    INVALID_DATE: "Invalid date format for end_date",
    QUANTITY_ERROR: "Requested quantity exceeds available quantity",
    CREATE_RENTAL_FAILED: "Failed to create rental",
    UPDATE_QUANTITY_FAILED: "Failed to update available quantity",
    RENTAL_ALREADY_COMPLETED: "Cannot cancel completed rental",
    INVALID_EXTEND_DATE: "New end date must be after the current end date",
    NO_RENTAL_HISTORY: "No rental history found",
    NO_RENTALS_FOUND: "No rentals found",
    ACCESS_DENIED: "Access denied: admins only"
};
const handleError = (res, statusCode, message) => {
    if (debug) console.error(message);
    res.status(statusCode).json({ error: message });
};
exports.createRental = async (req, res) => {
    try {
        const {
            user_id,
            item_id,
            quantity,
            start_date,
            end_date,
            paymentMethod,
            currency
        } = req.body;
    //check
        if (!user_id || !item_id || !quantity || !start_date || !end_date ||!paymentMethod||!currency) {
            return handleError(res, 400, ERROR_MESSAGES.REQUIRED_FIELDS);
        }
        const [item] = await rentalModel.fetchItem(item_id);
        if (!item || item.length === 0) {
            return handleError(res, 404, ERROR_MESSAGES.ITEM_NOT_FOUND);
        }
        const availableQuantity = item.available_quantity;
        if (quantity > availableQuantity) {
            return handleError(res, 400, ERROR_MESSAGES.QUANTITY_ERROR);
        }

    //process
        const dailyPrice = parseFloat(item.price_per_day);
        const rentalDays = (new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24);
        const totalItemPrice = dailyPrice * quantity * rentalDays;
        const insurance_fee= insurance_fee_percentage* totalItemPrice
        const platform_fee= platform_fee_percentage * totalItemPrice
        const total_price = totalItemPrice + (insurance_fee || 0) + (platform_fee || 0);
        const rentalData ={user_id, item_id, quantity, start_date, end_date, insurance_fee, platform_fee, total_price}

        const newRentalID = await rentalModel.createRental(rentalData);
        if (!newRentalID) {
            return handleError(res, 404, ERROR_MESSAGES.CREATE_RENTAL_FAILED);
        }
        try {
            await rentalModel.decreaseAvailableQuantity(item_id, quantity)
        } catch (err){
            handleError(res, 500, "Failed to decrease available quantity: Insufficient available quantity or item not found");

            res.status(500).json({ error: "Failed to decrease available quantity: Insufficient available quantity or item not found" });
        }
        res.status(201).json({
            message: "Rental initialized successfully, now you need to init payment",
            rental: {
                id: newRentalID, quantity, start_date, end_date, insurance_fee, total_price, status: 'pending'
            },
            redirectTo: `POST /api/v1/rentals/${newRentalID}/pay`,
            body:{
                amount:total_price,
                paymentMethod,
                currency
            }
        });
    } catch (error) {
        if (debug )console.error("Error rentalController/creatRental:", error);
        handleError(res, 500, debug ? `Error in rentalController/createRental: ${error.message}` : ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    }
};

exports.completeRental = async (req, res) => { //TODO : in payment, this done imppedely in code, so u should use this func
    try {
        const rentalId = parseInt(req.params.rentalId, 10);
    //check
        if (isNaN(rentalId)) {
            return handleError(res, 400, ERROR_MESSAGES.INVALID_RENTAL_ID);
        }
    //process
        const [result] = await rentalModel.cancelRental(rentalId)
        if (result.affectedRows === 0) {
            return handleError(res, 404, ERROR_MESSAGES.RENTAL_NOT_FOUND);
        }
        const [rental] = await rentalModel.getRentalDetails(rentalId);
        if (!rental) {
            return handleError(res, 404, ERROR_MESSAGES.RENTAL_NOT_FOUND);
        }
        if (rental.paid !== 1) {
            return res.status(404).json({ error: "Rental not paid yet" });
        }
        try {
            await rentalModel.increaseAvailableQuantity(rental.item_id, rental.quantity)
            res.json({ message: "Rental completed successfully" });
        }catch (err){
            handleError(res, 500, "Failed to increase available quantity: Insufficient available quantity or item not found");
        }
    } catch (error) {
        if (debug ) console.error("Error rentalController/completRental:", error);
        handleError(res, 500, debug ? `Error in rentalController/completeRental: ${error.message}` : ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    }
};

exports.cancelRental = async (req, res) => {//TODO: nest the cancling to payment !!!!
    try {
        const { rentalId } = req.params;
    //check
        if (isNaN(rentalId)) {
            return handleError(res, 400, ERROR_MESSAGES.INVALID_RENTAL_ID);
        }
        const [rental] = await rentalModel.getRentalDetails(rentalId);
        if (rental.length === 0) {
            return handleError(res, 404, ERROR_MESSAGES.RENTAL_NOT_FOUND);
        }if (rental[0].status === 'completed') {
            return handleError(res, 400, ERROR_MESSAGES.RENTAL_ALREADY_COMPLETED);
        }
        const cashback = rental[0].amount_paid * cashback_percentage

        const payment = await paymentModel.getPaymentDetailsByRentalId(rentalId);

        if (payment.length > 0) {
            const paymentId = payment[0].id;
            const paymentData = { rentalId:rentalId, paymentId: paymentId };
            const mockReq = {
                params: paymentData
            };
            const refundResponse = await processRefund(mockReq, res);
            if (refundResponse.error) {
                return res.status(refundResponse.status).json({ error: refundResponse.error });
            }
        }
    //process
        const result = await rentalModel.cancelRental(rentalId);
        if (result.affectedRows === 0) {
            return handleError(res, 400, ERROR_MESSAGES.RENTAL_ALREADY_CANCELLED);
        }
        try {
            await rentalModel.increaseAvailableQuantity(rental[0].item_id, rental[0].quantity)
            res.json({
                message: "Rental cancelled successfully",
                cashback: cashback,
                redirectTo: `PUT /api/v1/rentals/${rentalId}/payments/${result}/refund`
            });
        }catch (err){
            handleError(res, 500, ERROR_MESSAGES.INSUFFICIENT_QUANTITY);
        }
    } catch (error) {
        if (debug )  console.error("Error rentalController/cancelRental:", error);
        handleError(res, 500, debug ? `Error rentalController/cancelRental: ${error.message}` : "Internal Server Error");
    }
};

exports.extendRental = async (req, res) => {
    try {
        const rentalId = parseInt(req.params.rentalId, 10);
        const { end_date } = req.body;
    //check
        if (isNaN(rentalId) || !end_date) {
            return handleError(res, 400, ERROR_MESSAGES.REQUIRED_FIELDS);
        }
        const newEndDate = new Date(end_date);
        if (isNaN(newEndDate.getTime())) {
            return handleError(res, 400, ERROR_MESSAGES.INVALID_EXTEND_DATE);
        }
    //process
        const [rental] = await rentalModel.getRentalDetails(rentalId);
        if (rental.length === 0) {
            return handleError(res, 404, ERROR_MESSAGES.RENTAL_NOT_FOUND);
        }
        const currentRental = rental[0];
        if (currentRental.status !== 'pending') {
            return handleError(res, 400, ERROR_MESSAGES.RENTAL_ALREADY_COMPLETED);
        }
        if (newEndDate <= new Date(currentRental.end_date)) {
            return handleError(res, 400, ERROR_MESSAGES.INVALID_EXTEND_DATE);
        }
        const result = await rentalModel.extendRental(rentalId,newEndDate)
        if (result.affectedRows === 0) {
            return handleError(res, 500, "Unable to extend rental");
        }
        res.json({ message: "Rental extended", new_end_date: newEndDate });
    } catch (error) {
        if (debug)  console.error("Error rentalController/extendRental:", error);
        handleError(res, 500, debug ? `Error rentalController/extendRental: ${error.message}` : "Internal Server Error");
    }
};

exports.viewRentalHistory = async (req, res) => {
    try {
        const { userId } = req.body;
        const { status } = req.query;
    //check
        if (!userId) {
            return handleError(res, 401, ERROR_MESSAGES.ACCESS_DENIED);
        }
    //process
        const [rentalHistory] = await rentalModel.getUserRentalHistory(userId, status);
        if (rentalHistory.length === 0) {
            return handleError(res, 404, ERROR_MESSAGES.NO_RENTAL_HISTORY);
        }
        res.json({ rentals: rentalHistory });
    } catch (error) {
        if (debug ) console.error("Error viewing rental history:", error);
        handleError(res, 500, debug ? `Error viewing rental history: ${error.message}` : "Internal Server Error");
    }
};
exports.viewRentalDetails = async (req, res) => {
    try {
        const rentalId = parseInt(req.params.rentalId, 10);
    //check
        if (isNaN(rentalId)) {
            return handleError(res, 400, ERROR_MESSAGES.INVALID_RENTAL_ID);
        }
    //process
        const [rental] = await rentalModel.getRentalDetails(rentalId);
        if (rental.length === 0) {
            return handleError(res, 404, ERROR_MESSAGES.RENTAL_NOT_FOUND);
        }
        res.json({ rental: rental[0] });
    } catch (error) {
        if (debug )   console.error("Error viewing rental details:", error);
        handleError(res, 500, debug ? `Error viewing rental details: ${error.message}` : "Internal Server Error");
    }
};


exports.viewAllRentals = async (req, res) => {
    try {
        // if (!req.user || req.user.role !== 'admin') {
        //     return res.status(403).json({ error: "Access denied admins only allowed" });
        // }
        const [allRentals] = await rentalModel.getAllRentals;
        if (allRentals.length === 0) {
            return handleError(res, 404, ERROR_MESSAGES.NO_RENTALS_FOUND);
        }
        res.json({ rentals: allRentals });
    } catch (error) {
        if (debug ) console.error("Error viewing all rentals:", error);
        handleError(res, 500, debug ? `Error viewing all rentals: ${error.message}` : "Internal Server Error");
    }
};
