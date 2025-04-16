require('dotenv').config();
const mysql = require('mysql2'); // Use mysql2 instead of mysql

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

  module.exports = connection;