const express = require('express');
//const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connection = require('../db');
const router = express.Router();

const SECRET = process.env.JWT_SECRET || 'default_secret';

router.post('/register', async (req, res) => {
  const { email, username, password } = req.body;
  //const hashedPassword = await bcrypt.hash(password, 10);

  connection.query(
    'INSERT INTO users (email, username, password) VALUES (?, ?, ?)',
    [email, username, password],
    (err) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'User registration failed' });
      }
      res.status(201).json({ message: 'User registered' });
    }
  );
});

router.post('/login', (req, res) => {
  const { identifier, password } = req.body;

  connection.query('SELECT * FROM users WHERE email = ? OR username = ?', [identifier, identifier], 
    (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ error: 'No user found' });
        }

        const user = results[0];
        if (user.password !== password) {
            return res.status(401).json({ error: 'Incorrect password' });
        }
        
        //const isMatch = await bcrypt.compare(password, user.password);

        const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '1h' });
        res.json({ token });
  });
});

module.exports = router;
