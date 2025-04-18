import express from 'express';
import fetchCookie from 'fetch-cookie';
import nodeFetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';
import mysql from 'mysql2';
import cookieParser from 'cookie-parser';



dotenv.config();

const app = express();
const fetch = fetchCookie(nodeFetch);
const PHP_BACKEND = 'https://cise.ufl.edu/~t.lu/cis4930/php-backend';

app.use(express.json());
app.use(cookieParser());


app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://chat.openai.com',
    'https://chatgpt.com',
    'https://www.chatgpt.com',
    'https://green-gpt-dusky.vercel.app'
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

// app.get('/api/users', async (req, res) => {
//   // SQL query to get data from a 'users' table
//   connection.query('SELECT * FROM users', (err, results) => {
//     if (err) {
//       console.error('Query error:', err.message);
//       res.status(500).json({ error: err.message });
//       return;
//     }

    
//     res.json(results);
//   });
//   try {
//     const response = await fetch(`${PHP_BACKEND}/users.php`, {
//       method: 'GET',
//       headers: { 'Content-Type': 'application/json' },
//       credentials: 'include', 
//     });
//     const data = await response.json();
//     res.status(response.status).json(data);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Query error' });
//   }
// });

async function parsePhpJson(response) {
  const raw = await response.text();
  console.log('🐛 Raw response from PHP:\n', raw);

  const cleanedLines = raw
    .split('\n')
    .filter(line => !line.trim().startsWith('#!'))
    .join('\n')  
    .trim();


console.log('Char at fail index 57:', cleanedLines[57]);

  

  try {
    return JSON.parse(cleanedLines);
  } catch (err) {
    console.error('Failed to parse cleaned JSON:\n', cleanedLines);
    throw err;
  }
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

// User/Authentication routes

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

// Check login status
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

// Fetches list of users from the database
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

//app.use('/api/auth', authRoute);

// Token usage and energy estimate routes

app.post('/api/token-usage', async (req, res) => {

  const { promptTokens, responseTokens, timestamp } = req.body;

  if (!promptTokens || !responseTokens || !timestamp) {
    console.warn("⚠️ Missing fields in token-usage:", req.body);
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const user_id = await getUserIdFromSession(req);
    
    const sql = `INSERT INTO tokens (user_id, prompt_tokens, completion_tokens, timestamp)
                 VALUES (?, ?, ?, ?)`;

    connection.query(sql, [user_id, promptTokens, responseTokens, new Date(timestamp)], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database insert failed" });
      }
      console.log("✅ Token usage logged:", result.insertId);
      res.status(201).json({ message: "Token usage recorded" });
    });
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
});


app.get('/api/energy-estimate', async (req, res) => {
  try {
    const user_id = await getUserIdFromSession(req);

    const sql = `
      SELECT SUM(energy_used_wh) AS total_energy_used
      FROM energy_usage
      WHERE user_id = ?
    `;

    connection.query(sql, [user_id], (err, results) => {
      if (err) {
        console.error('Energy estimate fetch error:', err.message);
        return res.status(500).json({ error: 'Failed to fetch energy estimate' });
      }

      const totalRaw = results[0].total_energy_used;
      console.log("Fetched total_energy_used:", totalRaw, "Type:", typeof totalRaw);
      
      const total = Number(totalRaw) || 0;
      res.json({ total_energy_used: parseFloat(total.toFixed(2)) });
    });
  } catch (err) {
    console.error('Energy estimate route error:', err.message);
    res.status(401).json({ error: 'Unauthorized' });
  }
});



app.post('/api/energy-estimate', async (req, res) => {
  const totalTokens = parseInt(req.body.totalTokens || 0);
  const timestamp = req.body.timestamp;

  if (!totalTokens || totalTokens <= 0) {
    return res.status(400).json({ error: 'Missing or invalid totalTokens' });
  }

  try {
    const user_id = await getUserIdFromSession(req);
    console.log("Logging energy usage for user:", user_id);

    const gflopsPerToken = 600;
    const gflopsTotal = totalTokens * gflopsPerToken;
    const gflopsPerJoule = 15;
    const joules = gflopsTotal / gflopsPerJoule;
    const wh = joules / 3600;

    const result = {
      total_tokens: totalTokens,
      estimated_energy_wh: parseFloat(wh.toFixed(4))
    };

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
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ ...result, db_id: dbResult.insertId || null });
      }
    );
  } catch (err) {
    console.error("Energy usage error:", err.message);
    res.status(401).json({ error: 'Unauthorized' });
  }
});

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
      if (err) {
        console.error('Fetch goals error:', err.message);
        return res.status(500).json({ error: 'Database error fetching goals' });
      }

      res.json(results);
    });
  } catch (err) {
    console.error("Goals fetch error:", err.message);
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// Fetch and update goals

app.post('/api/goals', async (req, res) => {
  const { duration, energy_limit } = req.body;

  if (!duration || !energy_limit) {
    return res.status(400).json({ error: 'Missing required fields: duration and energy_limit' });
  }

  try {
    const user_id = await getUserIdFromSession(req);

    const mysqlFormattedDate = new Date(duration)
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');

    const sql = `
      INSERT INTO goals (user_id, duration, energy_limit)
      VALUES (?, ?, ?)
    `;

    connection.query(sql, [user_id, mysqlFormattedDate, energy_limit], (err, result) => {
      if (err) {
        console.error('Insert goal error:', err.message);
        return res.status(500).json({ error: 'Database error inserting goal' });
      }

      res.status(201).json({ message: 'Goal created successfully', goal_id: result.insertId });
    });
  } catch (err) {
    console.error("Goal creation error:", err.message);
    res.status(401).json({ error: 'Unauthorized' });
  }
});

app.delete('/api/goals/:id', async (req, res) => {
  const goalId = req.params.id;

  try {
    const user_id = await getUserIdFromSession(req);

    const sql = `
      DELETE FROM goals
      WHERE goal_id = ? AND user_id = ?
    `;

    connection.query(sql, [goalId, user_id], (err, result) => {
      if (err) {
        console.error('Delete goal error:', err.message);
        return res.status(500).json({ error: 'Failed to delete goal' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Goal not found or not authorized' });
      }

      res.status(200).json({ message: 'Goal deleted successfully' });
    });
  } catch (err) {
    console.error('Delete goal auth error:', err.message);
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// Friendship handling routes

// Sends a friend request to a user if the user exists and is not already a friend
app.post('/api/friends/add', async (req, res) => {
  try {
    const response = await fetch(`${PHP_BACKEND}/friends/add_friend.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': req.headers.cookie || ''
      },
      body: JSON.stringify(req.body),
      credentials: 'include'
    });
    const data = await parsePhpJson(response);
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Could not add friend' });
  }
});

// Function to accept or decline a friend request
app.post('/api/friends/respond', async (req, res) => {
  try {
    const response = await fetch(`${PHP_BACKEND}/friends/response.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': req.headers.cookie || ''
      },
      body: JSON.stringify(req.body),
      credentials: 'include'
    });
    const data = await parsePhpJson(response);
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Could not respond to request' });
  }
});


// Fetches the list of friends for the logged-in user
app.get('/api/friends/list', async (req, res) => {
  try {
    const response = await fetch(`${PHP_BACKEND}/friends/friendlist.php`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': req.headers.cookie || ''
      },
      credentials: 'include'
    });

    const data = await parsePhpJson(response); 
    res.status(response.status).json(data);

  } catch (err) {
    console.error('friendlist error:', err);
    res.status(500).json({ error: 'Could not fetch friends' });
  }
});


// Fetches the list of pending friend requests for the logged-in user
app.get('/api/friends/requests', async (req, res) => {
  try {
    const response = await fetch(`${PHP_BACKEND}/friends/listrequest.php`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': req.headers.cookie || ''
      },
      credentials: 'include'
    });
    const data = await parsePhpJson(response);
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch requests' });
  }
});

// Fetch monthly energy usage data

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