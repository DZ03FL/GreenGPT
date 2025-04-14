require('dotenv').config();
const express = require('express');
const app = express();
const authRoute = require('./controllers/auth');
const connection = require('./db');

app.use(express.json());

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

app.use('/api/auth', authRoute);


app.listen(5000, () => console.log('Server started on port 5000'));
