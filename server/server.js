const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection configuration
const db = mysql.createConnection({
  host: '192.169.1.189',
  user: 'clubadmin',  // Replace with your MySQL username
  password: 'database457',   // Replace with your MySQL password
  port: 3306,
  database: 'club_management'
});

// Connect to database
db.connect(err => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// API endpoint to execute queries
app.post('/api/query', (req, res) => {
  const { query } = req.body;
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ results });
  });
});

// API endpoint to get table names
app.get('/api/tables', (req, res) => {
  const query = 'SHOW TABLES';
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    const tables = results.map(row => Object.values(row)[0]);
    res.json({ tables });
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
