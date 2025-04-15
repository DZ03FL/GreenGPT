require('dotenv').config();
const express = require('express');
const app = express();
const authRoute = require('./controllers/auth');
const connection = require('./db');
const fetch = require('node-fetch');

const PHP_BACKEND = 'http://localhost:8000'; 

app.use(express.json());

app.get('/api/users', async (req, res) => {
  // SQL query to get data from a 'users' table
  /*connection.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Query error:', err.message);
      res.status(500).json({ error: err.message });
      return;
    }

    // Send the query results back in the response
    res.json(results);
  });*/
  try {
    const response = await fetch(`${PHP_BACKEND}/users.php`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Query error' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const response = await fetch(`${PHP_BACKEND}/controllers/register.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration error' });
  }
});


app.post('/api/auth/login', async (req, res) => {
  try {
    const response = await fetch(`${PHP_BACKEND}/controllers/login.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login error' });
  }
});

//app.use('/api/auth', authRoute);


app.listen(5000, () => console.log('Server started on port 5000'));
