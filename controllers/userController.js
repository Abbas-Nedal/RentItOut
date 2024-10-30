const db = require('../database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const SALT_ROUNDS = 12;


exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  
      if (user.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      const storedHashedPassword = user[0].password;
  
      const isMatch = await bcrypt.compare(password, storedHashedPassword);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      const token = jwt.sign(
        { id: user[0].id, role: user[0].role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      return res.json({ token });
  
    } catch (error) {
      console.error('Error logging in:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };


exports.getUsers = async (req, res) => {
    try {
        const [users] = await db.query('SELECT name, address, phone_number FROM users');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};
exports.getUserLimitedInfoById = async (req, res) => {
    try {
        const [user] = await db.query(
            'SELECT name, address, phone_number FROM users WHERE id = ?',
            [req.params.id]
        );
        if (user.length > 0) {
            res.status(200).json(user[0]); 
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};
exports.getUsersLimitedInfoByName = async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT name, address, phone_number FROM users WHERE name = ?',
            [req.params.name]
        );
        if (users.length > 0) {
            res.status(200).json(users);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};



exports.getUsersAllInfo = async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, name, email, phone_number, address, role, verified, created_at FROM users');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};
exports.getUsersAllInfoById = async (req, res) => {
    try {
        const [user] = await db.query(
            'SELECT id, name, email, phone_number, address, role, verified, created_at FROM users WHERE id = ?',
            [req.params.id]
        );
        if (user.length > 0) {
            res.status(200).json(user[0]);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};
exports.getUsersAllInfoByName = async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT id, name, email, phone_number, address, role, verified, created_at FROM users WHERE name = ?',
            [req.params.name]
        );
        if (users.length > 0) {
            res.status(200).json(users);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};




exports.createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, email, password, phone_number, address } = req.body;

        const defaultRole = 'user';
        const defaultVerified = 1; 

        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Email is already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        await db.query(
            'INSERT INTO users (name, email, password, phone_number, address, role, verified, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, CONVERT_TZ(NOW(), "+00:00", "+03:00"))',
            [name, email, hashedPassword, phone_number, address, defaultRole, defaultVerified]
        );

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create user' });
    }
};

exports.updateUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const userIdFromToken = req.user.id;  
        const userRoleFromToken = req.user.role; 

        const id = parseInt(req.params.id);

        if (userIdFromToken !== id && userRoleFromToken !== 'admin') {
            return res.status(403).json({ error: 'Forbidden: You cannot update another user\'s profile' });
        }

        const { email, password, name, phone_number, address, role, verified } = req.body;
        const [user] = await db.query('SELECT * FROM users WHERE id = ?', [id]);

        if (user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        if ((role || verified !== undefined) && userRoleFromToken !== 'admin') {
            return res.status(403).json({ error: 'Forbidden: You cannot change role or verification status' });
        }

        if (email && email !== user[0].email) {
            const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
            if (existingUser.length > 0) {
                return res.status(400).json({ error: 'Email is already in use' });
            }
        }

        const updatedPassword = password
            ? await bcrypt.hash(password, SALT_ROUNDS)
            : user[0].password;

        const query = userRoleFromToken === 'admin'
            ? 'UPDATE users SET name = ?, email = ?, password = ?, phone_number = ?, address = ?, role = ?, verified = ? WHERE id = ?'
            : 'UPDATE users SET name = ?, email = ?, password = ?, phone_number = ?, address = ? WHERE id = ?';

        const params = userRoleFromToken === 'admin'
            ? [
                name || user[0].name,
                email || user[0].email,
                updatedPassword,
                phone_number || user[0].phone_number,
                address || user[0].address,
                role || user[0].role,
                verified != null ? verified : user[0].verified,
                id
              ]
            : [
                name || user[0].name,
                email || user[0].email,
                updatedPassword,
                phone_number || user[0].phone_number,
                address || user[0].address,
                id
              ];

        await db.query(query, params);

        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};



exports.deleteUser = async (req, res) => {
    try {
        const userIdFromToken = req.user.id;  
        const userRoleFromToken = req.user.role;  
        const { id } = req.params;  

        if (userIdFromToken !== parseInt(id) && userRoleFromToken !== 'admin') {
            return res.status(403).json({ error: 'Forbidden: You can delete your account only' });
        }

        const [user] = await db.query('SELECT * FROM users WHERE id = ?', [id]);

        if (user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        await db.query('DELETE FROM users WHERE id = ?', [id]);

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};
