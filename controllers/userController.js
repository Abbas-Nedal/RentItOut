const db = require('../database');
const bcrypt = require('bcrypt');
const logger = require('../config/logger');
const { validationResult } = require('express-validator');

exports.getUsers = async (req, res) => {
    try {
        const [users] = await db.query('SELECT * FROM users');
        res.status(200).json(users);
    } catch (err) {
        logger.error(`Failed to fetch users: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const [user] = await db.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
        if (user.length > 0) {
            res.status(200).json(user[0]);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        logger.error(`Failed to fetch user: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};

exports.createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { name, email, password, phone_number, address, role, verified } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
            'INSERT INTO users (name, email, password, phone_number, address, role, verified, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, CONVERT_TZ(NOW(), "+00:00", "+03:00"))',
            [name, email, hashedPassword, phone_number, address, role, verified]
        );

        logger.info(`User ${email} created successfully`);
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        logger.error(`Failed to create user: ${err.message}`);
        res.status(500).json({ error: 'Failed to create user' });
    }
};
exports.updateUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, email, password, phone_number, address, role, verified } = req.body;
        const [user] = await db.query('SELECT * FROM users WHERE id = ?', [req.params.id]);

        if (user.length > 0) {
            const updatedName = name || user[0].name;
            const updatedEmail = email || user[0].email;
            const updatedPhoneNumber = phone_number || user[0].phone_number;
            const updatedAddress = address || user[0].address;
            const updatedRole = role || user[0].role;
            const updatedVerified = verified !== undefined ? verified : user[0].verified;

            let updatedPassword = user[0].password;
            if (password) {
                updatedPassword = await bcrypt.hash(password, 10);
            }

            await db.query(
                'UPDATE users SET name = ?, email = ?, password = ?, phone_number = ?, address = ?, role = ?, verified = ? WHERE id = ?',
                [updatedName, updatedEmail, updatedPassword, updatedPhoneNumber, updatedAddress, updatedRole, updatedVerified, req.params.id]
            );

            logger.info(`User ${req.params.id} updated successfully`);
            res.status(200).json({ message: 'User updated successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        logger.error(`Failed to update user: ${err.message}`);
        res.status(500).json({ error: 'Failed to update user' });
    }
};


exports.deleteUser = async (req, res) => {
    try {
        const [user] = await db.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
        if (user.length > 0) {
            await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
            logger.info(`User ${req.params.id} deleted successfully`);
            res.status(200).json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        logger.error(`Failed to delete user: ${err.message}`);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};
