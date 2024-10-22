// controllers/userController.js

const db = require('../database');

exports.getUsers = async (req, res) => {
    try {
        const [users] = await db.query('SELECT * FROM users');
        res.status(200).json(users);
    } catch (err) {
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
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { name, email, password, phone_number, address } = req.body;
        await db.query(
            'INSERT INTO users (name, email, password, phone_number, address) VALUES (?, ?, ?, ?, ?)',
            [name, email, password, phone_number, address]
        );
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create user' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { name, email, password, phone_number, address } = req.body;
        const [user] = await db.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
        if (user.length > 0) {
            await db.query(
                'UPDATE users SET name = ?, email = ?, password = ?, phone_number = ?, address = ? WHERE id = ?',
                [name, email, password, phone_number, address, req.params.id]
            );
            res.status(200).json({ message: 'User updated successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to update user' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const [user] = await db.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
        if (user.length > 0) {
            await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
            res.status(200).json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
};
