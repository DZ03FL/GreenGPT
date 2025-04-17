import express from 'express';
import fetchCookie from 'fetch-cookie';
import nodeFetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';
import mysql from 'mysql2';

dotenv.config();

const app = express();
const fetch = fetchCookie(nodeFetch);
const PHP_BACKEND = 'https://cise.ufl.edu/~t.lu/cis4930/php-backend';

app.use(express.json());

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://chat.openai.com',
    'https://chatgpt.com',
    'https://www.chatgpt.com',
    'https://greengpt-theta.vercel.app'
  ],
  credentials: true,
}));

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection error:', err.message);
    return;
  }
  console.log('Connected to MySQL database from Node');
});

// 🔧 Helper to parse PHP responses that start with a shebang or extra output
async function parsePhpJson(response) {
  const raw = await response.text();
  const jsonStart = raw.indexOf('{');
  if (jsonStart === -1) throw new Error('Invalid response from PHP');
  return JSON.parse(raw.slice(jsonStart));
}

async function getUserIdFromSession(req) {
  const response = await fetch(`${PHP_BACKEND}/controllers/whoami.php`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': req.headers.cookie || ''
    },
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('User not authenticated');
  }

  const data = await parsePhpJson(response);
  return data.user_id;
}

// Authentication routes

app.post('/api/auth/register', async (req, res) => {
  try {
    const response = await fetch(`${PHP_BACKEND}/controllers/register.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
      credentials: 'include', 
    });
    const data = await parsePhpJson(response);
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
    const data = await parsePhpJson(response);
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
    const data = await parsePhpJson(response);
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
    const data = await parsePhpJson(response);
    res.status(response.status).json(data);
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// Users from local MySQL
app.get('/api/users', async (req, res) => {
  const sql = 'SELECT user_id, username, email FROM users';

  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err.message);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results); 
  });
});

// Token logging
app.post('/api/token-usage', async (req, res) => {
  const { promptTokens, responseTokens, timestamp } = req.body;

  try {
    const user_id = await getUserIdFromSession(req);
    const sql = `
      INSERT INTO tokens (user_id, prompt_tokens, completion_tokens, timestamp)
      VALUES (?, ?, ?, ?)
    `;
    connection.query(
      sql,
      [user_id, promptTokens, responseTokens, new Date(timestamp)],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Token usage recorded', id: result.insertId });
      }
    );
  } catch (err) {
    console.error("Token usage error:", err.message);
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// Energy estimate logging
app.post('/api/energy-estimate', async (req, res) => {
  const totalTokens = parseInt(req.body.totalTokens || 0);
  const timestamp = req.body.timestamp;

  if (!totalTokens || totalTokens <= 0) {
    return res.status(400).json({ error: 'Missing or invalid totalTokens' });
  }

  try {
    const user_id = await getUserIdFromSession(req);
    const gflopsPerToken = 600;
    const gflopsTotal = totalTokens * gflopsPerToken;
    const gflopsPerJoule = 15;
    const joules = gflopsTotal / gflopsPerJoule;
    const wh = joules / 3600;

    const energyWh = parseFloat(wh.toFixed(2));
    const month = new Date().getMonth() + 1;

    const insertSql = `
      INSERT INTO energy_usage (user_id, month, energy_used_wh, timestamp)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        energy_used_wh = energy_used_wh + VALUES(energy_used_wh),
        timestamp = VALUES(timestamp)
    `;

    connection.query(
      insertSql,
      [user_id, month, energyWh, new Date(timestamp)],
      (err, dbResult) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ 
          total_tokens: totalTokens,
          estimated_energy_wh: parseFloat(wh.toFixed(4)),
          db_id: dbResult.insertId || null 
        });
      }
    );
  } catch (err) {
    console.error("Energy usage error:", err.message);
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// Energy monthly breakdown
app.get('/api/energy-monthly', async (req, res) => {
  try {
    const user_id = await getUserIdFromSession(req);
    const sql = `
      SELECT month, SUM(energy_used_wh) AS total
      FROM energy_usage
      WHERE user_id = ?
      GROUP BY month
      ORDER BY month
    `;
    connection.query(sql, [user_id], (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json(results); 
    });
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// Goals
app.get('/api/goals', async (req, res) => {
  try {
    const user_id = await getUserIdFromSession(req);
    const sql = `
      SELECT goal_id, duration, energy_limit, achieved
      FROM goals
      WHERE user_id = ?
      ORDER BY duration ASC
    `;
    connection.query(sql, [user_id], (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error fetching goals' });
      res.json(results);
    });
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

app.post('/api/goals', async (req, res) => {
  const { duration, energy_limit } = req.body;
  if (!duration || !energy_limit) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const user_id = await getUserIdFromSession(req);
    const formatted = new Date(duration).toISOString().slice(0, 19).replace('T', ' ');
    const sql = `INSERT INTO goals (user_id, duration, energy_limit) VALUES (?, ?, ?)`;
    connection.query(sql, [user_id, formatted, energy_limit], (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error inserting goal' });
      res.status(201).json({ message: 'Goal created', goal_id: result.insertId });
    });
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

app.delete('/api/goals/:id', async (req, res) => {
  const goalId = req.params.id;
  try {
    const user_id = await getUserIdFromSession(req);
    const sql = `DELETE FROM goals WHERE goal_id = ? AND user_id = ?`;
    connection.query(sql, [goalId, user_id], (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to delete goal' });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
      res.json({ message: 'Goal deleted' });
    });
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// Friends

app.post('/api/friends/add', async (req, res) => {
  try {
    const response = await fetch(`${PHP_BACKEND}/friends/add_friend.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
      credentials: 'include'
    });
    const data = await parsePhpJson(response);
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Could not add friend' });
  }
});

app.post('/api/friends/respond', async (req, res) => {
  try {
    const response = await fetch(`${PHP_BACKEND}/friends/response.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
      credentials: 'include'
    });
    const data = await parsePhpJson(response);
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Could not respond to request' });
  }
});

app.get('/api/friends/list', async (req, res) => {
  try {
    const response = await fetch(`${PHP_BACKEND}/friends/friendlist.php`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });
    const data = await parsePhpJson(response);
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch friends' });
  }
});

app.get('/api/friends/requests', async (req, res) => {
  try {
    const response = await fetch(`${PHP_BACKEND}/friends/listrequest.php`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });
    const data = await parsePhpJson(response);
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch requests' });
  }
});

// Leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const me = await getUserIdFromSession(req);
    const response = await fetch(`${PHP_BACKEND}/friends/friendlist.php`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Cookie': req.headers.cookie || '' },
      credentials: 'include'
    });

    const friends = await parsePhpJson(response);
    const friendIds = friends.map(f => f.user_id);
    if (!friendIds.includes(me)) friendIds.push(me);
    const thisMonth = new Date().getMonth() + 1;

    const sql = `
      SELECT u.username AS name, ROUND(eu.energy_used_wh, 2) AS energySaved
      FROM energy_usage AS eu
      JOIN users AS u ON u.user_id = eu.user_id
      WHERE eu.month = ? AND eu.user_id IN (?)
      ORDER BY eu.energy_used_wh ASC
      LIMIT 10
    `;

    connection.query(sql, [thisMonth, friendIds], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

app.get('/', (req, res) => {
  res.send('GreenGPT backend is running!');
});

app.listen(5000, () => console.log('Server started on port 5000'));
