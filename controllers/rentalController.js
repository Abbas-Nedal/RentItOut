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
* */
const db = require('../database');
const rentalModel = require("../models/rentalModel");
const debug = true;
const platform_fee_percentage  = 0.1
const insurance_fee_percentage  = 0.05

//TODO : subtracte the number of items rented when compleete  ther fental form items
exports.createRental = async (req, res) => { //TODO:Handle multibile creations
    try {
        const {
            user_id,
            item_id,
            quantity,
            start_date,
            end_date
        } = req.body;
    //check
        if (!user_id || !item_id || !quantity || !start_date || !end_date) {
            return res.status(400).json({ error: "All required fields must be provided" });
        }
    //process
        const [itemPricePerDay] = await db.query(
            `SELECT price_per_day, available_quantity FROM items WHERE id = ?`, [item_id]
        );
        if (!itemPricePerDay || itemPricePerDay.length === 0) {
            return res.status(404).json({ error: "Item not found" });
        }
        const dailyPrice = parseFloat(itemPricePerDay[0].price_per_day);
        const availableQuantity = itemDetails[0].available_quantity;
        if (quantity > availableQuantity) {
            return res.status(400).json({ error: "available quantity less than requested for the requested item" });
        }

        const rentalDays = (new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24);
        const totalItemPrice = dailyPrice * quantity * rentalDays;
        const insurance_fee= insurance_fee_percentage* totalItemPrice
        const platform_fee= platform_fee_percentage * totalItemPrice
        const total_price = totalItemPrice + (insurance_fee || 0) + (platform_fee || 0);
        const rentalData ={user_id, item_id, quantity, start_date, end_date, insurance_fee, platform_fee, total_price}

        const newRental = await rentalModel.createRental(rentalData);
        try {
            await rentalModel.decreaseAvailableQuantity(item_id, quantity)
            res.status(201).json({ message: "Rental created", rental: { id: newRental.insertId, user_id, item_id, quantity, start_date, end_date, insurance_fee, total_price, status: 'pending'} });
        }catch (err){
            res.status(500).json({ error: "Failed to decrease available quantity: Insufficient available quantity or item not found" });
        }
    } catch (error) {
        if (debug )console.error("Error rentalController/creatRental:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.completeRental = async (req, res) => { //TODO : in payment, this done imppedely in code, so u should use this func
    try {
        const rentalId = parseInt(req.params.rentalId, 10);
    //check
        if (isNaN(rentalId)) {
            return res.status(400).json({ error: "Invalid rental ID" });
        }
    //process
        const [result] = await rentalModel.cancelRental(rentalId)
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Rental not found or already completed" });
        }
        const [rental] = await db.query(
            `SELECT quantity, item_id FROM rentals WHERE id = ?`, [rentalId]
        );
        if (!rental || rental.length === 0) {
            return res.status(404).json({ error: "Rental not found" });
        }
        try {
            await rentalModel.increaseAvailableQuantity(rental[0].item_id, rental[0].quantity)
            res.json({ message: "Rental completed successfully" });
        }catch (err){
            res.status(500).json({ error: "Failed to increase available quantity: Insufficient available quantity or item not found" });
        }
    } catch (error) {
        if (debug ) console.error("Error rentalController/completRental:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.cancelRental = async (req, res) => {//TODO: nest the cancling to payment !!!!
    try {
        const { rentalId } = req.params;
    //check
        if (isNaN(rentalId)) {
            return res.status(400).json({ error: "Invalid rental ID" });
        }
        const [rental] = await rentalModel.getRentalDetails(rentalId);
        if (rental.length === 0) {
            return res.status(404).json({ error: "Rental not found" });
        }if (rental[0].status === 'completed') {
            return res.status(400).json({ error: "Cannot cancel completed rental" });
        }
    //process
        const result = await rentalModel.cancelRental(rentalId);
        if (result.affectedRows === 0) {
            return res.status(400).json({ error: "Rental is already cancelled or cannot be found" });
        }
        try {
            await rentalModel.increaseAvailableQuantity(rental[0].item_id, rental[0].quantity)
            res.json({ message: "Rental cancelled successfully" });
        }catch (err){
            res.status(500).json({ error: "Failed to increase available quantity: Insufficient available quantity or item not found" });
        }
    } catch (error) {
        if (debug )  console.error("Error rentalController/cancelRental:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.extendRental = async (req, res) => {
    try {
        const rentalId = parseInt(req.params.rentalId, 10);
        const { end_date } = req.body;
    //check
        if (isNaN(rentalId) || !end_date) {
            return res.status(400).json({ error: "Invalid rental ID or New end date " });
        }
        const newEndDate = new Date(end_date);
        if (isNaN(newEndDate.getTime())) {
            return res.status(400).json({ error: "Invalid date format for end_date" });
        }
    //process
        const [rental] = await rentalModel.getRentalDetails(rentalId);
        if (rental.length === 0) {
            return res.status(404).json({ error: "Rental not found" });
        }
        const currentRental = rental[0];
        if (currentRental.status !== 'pending') {
            return res.status(400).json({ error: "Only pending rentals can be extended" });
        }
        if (newEndDate <= new Date(currentRental.end_date)) {
            return res.status(400).json({ error: "New end date must be after the current end date" });
        }
        const result = await rentalModel.extendRental(rentalId,newEndDate)
        if (result.affectedRows === 0) {
            return res.status(500).json({ error: "Unable to extend rental" });
        }
        res.json({ message: "Rental extended", new_end_date: newEndDate });
    } catch (error) {
        if (debug)  console.error("Error rentalController/extendRental:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.viewRentalHistory = async (req, res) => {
    try {
        const { userId } = req.body;
        const { status } = req.query;
    //check
        if (!userId) {
            return res.status(401).json({ error: "User ID not found" });
        }
    //process
        const [rentalHistory] = await rentalModel.getUserRentalHistory(userId, status);
        if (rentalHistory.length === 0) {
            return res.status(404).json({ message: "No rental history found" });
        }
        res.json({ rentals: rentalHistory });
    } catch (error) {
        if (debug ) console.error("Error viewing rental history:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.viewRentalDetails = async (req, res) => {
    try {
        const rentalId = parseInt(req.params.rentalId, 10);
    //check
        if (isNaN(rentalId)) {
            return res.status(400).json({ error: "Invalid rental ID" });
        }
    //process
        const [rental] = await rentalModel.getRentalDetails(rentalId);
        if (rental.length === 0) {
            return res.status(404).json({ error: "Rental not found" });
        }
        res.json({ rental: rental[0] });
    } catch (error) {
        if (debug )   console.error("Error viewing rental details:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


exports.viewAllRentals = async (req, res) => {
    try {
        // if (!req.user || req.user.role !== 'admin') {
        //     return res.status(403).json({ error: "Access denied admins only allowed" });
        // }
        const [allRentals] = await rentalModel.getAllRentals;
        if (allRentals.length === 0) {
            return res.status(404).json({ error: "No rentals found" });
        }
        res.json({ rentals: allRentals });
    } catch (error) {
        if (debug ) console.error("Error viewing all rentals:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
