import express from 'express';
import fetchCookie from 'fetch-cookie';
import nodeFetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const fetch = fetchCookie(nodeFetch);
const PHP_BACKEND = 'http://localhost:8000';

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

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
      credentials: 'include', 
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
      credentials: 'include', 
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
      credentials: 'include', 
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login error' });
  }
});

app.get('/api/auth/status', async (req, res) => {
  try {
    const response = await fetch(`${PHP_BACKEND}/controllers/status.php`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('Status check error:', err);
    res.status(500).json({ error: 'Could not verify login status' });
  }
});

app.post('/api/auth/logout', async (req, res) => {
  try {
    const response = await fetch(`${PHP_BACKEND}/controllers/logout.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: 'Logout failed' });
  }
});

//app.use('/api/auth', authRoute);


app.listen(5000, () => console.log('Server started on port 5000'));
