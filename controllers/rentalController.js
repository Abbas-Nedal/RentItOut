/*
* author : abdalsalam
* this code define the controllers for rentals endpoints
*
* rentals table :
*   id
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

const debug = true;
const platform_fee_percentage  = 0.1
const insurance_fee_percentage  = 0.05

exports.createRental = async (req, res) => {
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
        const itemPricePerDay = await db.query(
            `SELECT price_per_day FROM items WHERE id = ?`, [item_id]
        );
        if (itemPricePerDay.length === 0) {
            return res.status(404).json({ error: "Item not found" });
        }
        const dailyPrice = itemPricePerDay[0].price_per_day;
        const rentalDays = (new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24);
        const totalItemPrice = dailyPrice * quantity * rentalDays;
        const insurance_fee= insurance_fee_percentage*totalItemPrice
        const  platform_fee= platform_fee_percentage*totalItemPrice

        const total_price = totalItemPrice + (insurance_fee || 0) + (platform_fee || 0);
        const newRental = await db.query(
            `INSERT INTO rentals (user_id, item_id,created_at, quantity, start_date, end_date, insurance_fee, platform_fee, status, total_price) VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, 'pending', ?)`,
            [user_id, item_id, quantity, start_date, end_date, insurance_fee, platform_fee, total_price]
        );
        res.status(201).json({ message: "Rental created", rental: { id: newRental.insertId, user_id, item_id, quantity, start_date, end_date, insurance_fee, platform_fee, total_price, status: 'pending'} });
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
        //TODO : insert completed_at
        const [result] = await db.query(
            `UPDATE rentals SET status = 'completed', completed_at = NOW() 
             WHERE id = ? AND status = 'pending'`,
            [rentalId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Rental not found or already completed" });
        }
        res.json({ message: "Rental completed successfully" });
    } catch (error) {
        console.error("Error completing rental:", error);
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
        const rental = await db.query(
            `SELECT status FROM rentals WHERE id = ?`,
            [rentalId]
        );
        if (rental.length === 0) {
            return res.status(404).json({ error: "Rental not found" });
        }if (rental[0].status === 'completed') {
            return res.status(400).json({ error: "Cannot cancel completed rental" });
        }
    //process
        const result = await db.query(
            `UPDATE rentals SET status = 'cancelled' WHERE id = ? AND status != 'completed'`,
            [rentalId]
        );
        if (result.affectedRows === 0) {
            return res.status(400).json({ error: "Rental is already cancelled or cannot be found" });
        }
        res.json({ message: "Rental cancelled successfully" });
    } catch (error) {
        console.error("Error cancelling rental:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.viewRentalHistory = async (req, res) => {

};
exports.viewRentalDetails = async (req, res) => {

};

exports.viewActiveRentals = async (req, res) => {

};
exports.extendRental = async (req, res) => {

};
exports.viewAllRentals = async (req, res) => {

};
