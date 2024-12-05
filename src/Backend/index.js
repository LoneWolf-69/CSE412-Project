const express = require("express");
const cors = require("cors");
const pool = require("./db"); // Import the database connection

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// Routes

// 1. Register a new user
app.post("/api/register", async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
      const result = await pool.query(
        "INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
        [firstName, lastName, email, password]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Registration failed" });
    }
  });

// 2. User login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, password]
    );

    if (result.rows.length > 0) {
      res.status(200).json({ message: "Login successful", user: result.rows[0] });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Login failed" });
  }
});

// 3. Get all users (for debugging)
app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to retrieve users" });
  }
});


app.get('/api/airports', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM airport ORDER BY airportname');
    console.log('Airports fetched:', result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching airports:', err);
    res.status(500).json({ error: 'Error retrieving airports' });
  }
});

app.get('/api/flights', async (req, res) => {
  const { from, to, departDate } = req.query;

  console.log('Received flight search parameters:', { from, to, departDate });

  const flightQuery = `
    SELECT 
      f.flightid, 
      f.flightnumber, 
      f.departuredatetime, 
      f.arrivaldatetime, 
      f.price,
      f.aircrafttype,
      da.airportname AS departure_airport,
      da.airportcode AS departure_code, 
      aa.airportname AS arrival_airport,
      aa.airportcode AS arrival_code,
      al.airlinename AS airline_name
    FROM flight f
    INNER JOIN airport da ON f.departureairport = da.airportid
    INNER JOIN airport aa ON f.arrivalairport = aa.airportid
    INNER JOIN airline al ON f.airlineid = al.airlineid
    WHERE da.airportcode = $1 
    AND aa.airportcode = $2 
    AND DATE(f.departuredatetime) = $3::date
  `;

  try {
    console.log('Executing flight query with parameters:', { from, to, departDate });
    const flightResult = await pool.query(flightQuery, [from.toUpperCase(), to.toUpperCase(), departDate]);
    console.log('Flight query result:', flightResult.rows);

    res.json({
      flights: flightResult.rows,
      count: flightResult.rows.length
    });
  } catch (err) {
    console.error('Database Error:', err);
    res.status(500).json({ error: 'Error retrieving flights' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

