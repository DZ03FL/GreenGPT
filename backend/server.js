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
        console.error('Insert error:', err.message);
        res.status(500).json({ error: err.message });
        return;
      }
      console.log('Insert successful, ID:', result.insertId);
      res.status(201).json({ message: 'Token usage recorded', id: result.insertId });
    }
  );
});



app.listen(5000, () => console.log('Server started on port 5000'));
