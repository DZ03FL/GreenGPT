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

//app.use('/api/auth', authRoute);

app.post('/api/token-usage', (req, res) => {
  const { promptTokens, responseTokens, timestamp } = req.body;
  const user_id = 1;

  console.log("Received token usage data:", req.body); 

  const sql = `
    INSERT INTO tokens (user_id, prompt_tokens, completion_tokens, timestamp)
    VALUES (?, ?, ?, ?)
  `;

  connection.query(
    sql,
    [user_id, promptTokens, responseTokens, new Date(timestamp)],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      console.log("Successfuly logged Tokens Into Database")
      res.status(201).json({ message: 'Token usage recorded', id: result.insertId });
    }
  );
});

app.post('/api/energy-estimate', (req, res) => {
  const totalTokens = parseInt(req.body.totalTokens || 0);
  const timestamp = req.body.timestamp;

  if (!totalTokens || totalTokens <= 0) {
    return res.status(400).json({ error: 'Missing or invalid totalTokens' });
  }

  const gflopsPerToken = 600;
  const gflopsTotal = totalTokens * gflopsPerToken;

  const gflopsPerJoule = 15;
  const joules = gflopsTotal / gflopsPerJoule;

  const wh = joules / 3600;

  const result = {
    total_tokens: totalTokens,
    estimated_energy_wh: parseFloat(wh.toFixed(4)),
  };

  const user_id = 1; 
  const energyWh = parseFloat(wh.toFixed(2)); 
  const month = new Date().getMonth() + 1;

  const insertEnergySql = `
    INSERT INTO energy_usage (user_id, month, energy_used_wh, timestamp)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
      energy_used_wh = energy_used_wh + VALUES(energy_used_wh),
      timestamp = VALUES(timestamp)
  `;

  connection.query(
    insertEnergySql,
    [user_id, month, energyWh, new Date(timestamp)],
    (err, dbResult) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      console.log("Successfully logged Energy Usage Into Database")
      res.status(201).json({ ...result, db_id: dbResult.insertId || null });
    }
  );
});







app.listen(5000, () => console.log('Server started on port 5000'));
