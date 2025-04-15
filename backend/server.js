require('dotenv').config();
const express = require('express');
const mysql = require('mysql2'); 
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());


const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,  
  ssl: {
    rejectUnauthorized: false 
  }
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection error:', err.message);
    return;
  }
  console.log('Connected to MySQL database.');
});

app.get('/api/users', (req, res) => {
 
  connection.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Query error:', err.message);
      res.status(500).json({ error: err.message });
      return;
    }

    
    res.json(results);
  });
});

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
