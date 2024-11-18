const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Create a MySQL connection using credentials from the .env file
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the MySQL database');
  }
});

// Question 1: Retrieve all patients
app.get('/patients', (req, res) => {
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
  
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ message: 'Error retrieving patients', error: err });
    } else {
      res.status(200).json(results);
    }
  });
});

// Question 2: Retrieve all providers
app.get('/providers', (req, res) => {
  const query = 'SELECT first_name, last_name, provider_specialty FROM providers';
  
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ message: 'Error retrieving providers', error: err });
    } else {
      res.status(200).json(results);
    }
  });
});

// Question 3: Filter patients by first name
app.get('/patients/filter', (req, res) => {
  const firstName = req.query.first_name; // Use query parameter for first_name

  if (!firstName) {
    return res.status(400).json({ message: 'First name query parameter is required' });
  }

  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
  
  db.query(query, [firstName], (err, results) => {
    if (err) {
      res.status(500).json({ message: 'Error retrieving patients', error: err });
    } else {
      res.status(200).json(results);
    }
  });
});

// Question 4: Retrieve all providers by specialty
app.get('/providers/specialty', (req, res) => {
  const specialty = req.query.specialty; // Use query parameter for provider specialty
  
  if (!specialty) {
    return res.status(400).json({ message: 'Specialty query parameter is required' });
  }

  const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
  
  db.query(query, [specialty], (err, results) => {
    if (err) {
      res.status(500).json({ message: 'Error retrieving providers by specialty', error: err });
    } else {
      res.status(200).json(results);
    }
  });
});

// Listen to the server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
