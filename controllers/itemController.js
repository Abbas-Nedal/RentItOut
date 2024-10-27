// controllers/itemController.js

/*
    This is Code responsible for managing items.
 */
const db = reqiure('../database');
const logger = require('../config/logger');

// Create new item
exports.createitem = async (req,res) => {
    try{
        const{user_id, name , description , quantity , category , price_per_day , available} = req.body;

        const [item]= await db.query(
            `INSERT INTO items (user_id, name, description, quantity, category, price_per_day, available, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
        [user_id, name, description, quantity, category, price_per_day, available]
    );
        logger.info(`Item ${name} create successfully`);
         res.status(201).json({ message: 'Item created successfully.' });
    }catch (err) {
            logger.error(`Faild to create item :${err.message}`);
            res.status(500).json({ error: 'Failed to create item.' });
        }
    };

// Update item by item_id
exports.updateItem = async (req, res) => {
    try {
        const { item_id } = req.params;
        const { user_id, name, description, quantity, category, price_per_day, available } = req.body;

        const [item] = await db.query(`SELECT * FROM items WHERE id = ?`, [item_id]);

        if (item.length === 0) {
            logger.warn(`item with  ${item_id} not found`);
            return res.status(404).json({ error: 'item not found.' });
        }

        await db.query(
            `UPDATE items SET  user_id = ?, name = ?,  description = ?,  quantity = ?,  category = ?, price_per_day = ?, available = ?, updated_at = NOW()
 WHERE id = ?`,
            [
                user_id || item[0].user_id,
                name || item[0].name,
                description || item[0].description,
                quantity || item[0].quantity,
                category || item[0].category,
                price_per_day || item[0].price_per_day,
                available !== undefined ? available : item[0].available,
                item_id
            ]
        );

        logger.info(`Item ${item_id} updated successfully`);
        res.status(200).json({ message: 'item updated successfully.' });
    } catch (err) {
        logger.error(`Failed to update item: ${err.message}`);
        res.status(500).json({ error: 'Failed to update item.' });
    }
};

// Delete item by item_id
exports.deleteItem = async (req, res) => {
    try {
        const { item_id } = req.params;
        const [item] = await db.query(`SELECT * FROM items WHERE id = ?`, [item_id]);

        if (item.length === 0) {
            logger.warn(`Item with ID ${item_id} not found`);
            return res.status(404).json({ error: 'Item not found.' });
        }
        await db.query(`DELETE FROM items WHERE id = ?`, [item_id]);
        logger.info(`Item ${item_id} deleted successfully`);
        res.status(200).json({ message: 'Item deleted successfully.' });
    } catch (err) {
        logger.error(`Failed to delete item: ${err.message}`);
        res.status(500).json({ error: 'Failed to delete item.' });
    }
};


//  Get item by item_id
exports.getItemById = async (req, res) => {
    try {
        const { item_id } = req.params;

        const [item] = await db.query(
            `SELECT * FROM items WHERE id = ?`, [item_id]
        );

        if (item.length === 0) {
            logger.warn(`Item with ID ${item_id} not found`);
            return res.status(404).json({ error: 'Item not found.' });
        }
        res.status(200).json(item[0]);
    } catch (err) {
        logger.error(`Failed to fetch item: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch item.' });
    }
};