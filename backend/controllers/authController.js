const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    const { username, name, email, password } = req.body;

    try {
        // Check if user exists
        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ? OR username = ?', [email, username]);
        if (existingUser.length > 0) {
            return res.status(400).json({ msg: 'User already exists with this email or username' });
        }

        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await db.query(
            'INSERT INTO users (username, name, email, password_hash) VALUES (?, ?, ?, ?)',
            [username, name, email, hashedPassword]
        );

        // Return JWT
        const payload = {
            user: {
                id: result.insertId,
                name: name,
                email: email
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: payload.user });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const user = users[0];

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Return JWT
        const payload = {
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: payload.user });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getUser = async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, username, name, email, created_at FROM users WHERE id = ?', [req.user.id]);
        if (users.length === 0) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(users[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
