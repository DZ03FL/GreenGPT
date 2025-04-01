require('dotenv').config();
const express = require('express');
const mysql = require('mysql2'); // Use mysql2 instead of mysql
const app = express();


const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,  // Use the port if it's different from the default
  ssl: {
    rejectUnauthorized: false // This enforces SSL for DigitalOcean
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
  // SQL query to get data from a 'users' table
  connection.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Query error:', err.message);
      res.status(500).json({ error: err.message });
      return;
    }

    // Send the query results back in the response
    res.json(results);
  });
});


app.listen(5000, () => console.log('Server started on port 5000'));
