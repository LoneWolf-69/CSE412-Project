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
// In index.js
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, password]
    );

    if (result.rows.length > 0) {
      // Return userId in the response
      res.status(200).json({ 
        message: "Login successful", 
        userId: result.rows[0].userid // Ensure the field name matches your database
      });
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


// New route for getting user bookings
app.get("/api/bookings/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      `SELECT b.*, f.FlightNumber, f.DepartureDateTime, f.ArrivalDateTime, 
              da.AirportName AS DepartureAirport, aa.AirportName AS ArrivalAirport
       FROM Booking b
       JOIN Flight f ON b.FlightID = f.FlightID
       JOIN Airport da ON f.DepartureAirport = da.AirportID
       JOIN Airport aa ON f.ArrivalAirport = aa.AirportID
       WHERE b.UserID = $1`,
      [userId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to retrieve bookings" });
  }
});

// New route for getting user profile
app.get("/api/users/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query("SELECT * FROM Users WHERE UserID = $1", [userId]);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to retrieve user profile" });
  }
});

// Update the booking creation route to include itinerary creation
app.post("/api/bookings", async (req, res) => {
  const { userId, flightId, numberOfPassengers } = req.body;
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Check flight availability
    const flightCheck = await client.query(
      "SELECT availableseats, departuredatetime, arrivaldatetime FROM flight WHERE flightid = $1",
      [flightId]
    );
    
    if (flightCheck.rows.length === 0) {
      throw new Error("Flight not found");
    }
    
    if (flightCheck.rows[0].availableseats < numberOfPassengers) {
      throw new Error("Not enough available seats");
    }

    // Create the booking
    const bookingResult = await client.query(
      `INSERT INTO booking 
       (userid, flightid, bookingdate, bookingstatus, numberofpassengers) 
       VALUES ($1, $2, CURRENT_DATE, 'Confirmed', $3) 
       RETURNING bookingid`,
      [userId, flightId, numberOfPassengers]
    );

    const bookingId = bookingResult.rows[0].bookingid;

    // Create itinerary
    const itineraryResult = await client.query(
      `INSERT INTO itinerary 
       (bookingid, flightid, departuredatetime, arrivaldatetime, seatnumber, gatenumber, baggageinfo) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [
        bookingId,
        flightId,
        flightCheck.rows[0].departuredatetime,
        flightCheck.rows[0].arrivaldatetime,
        'Auto-assigned', // You can implement seat assignment logic here
        'TBD',          // Gate number can be updated later
        'Standard baggage allowance'
      ]
    );

    // Update available seats
    await client.query(
      "UPDATE flight SET availableseats = availableseats - $1 WHERE flightid = $2",
      [numberOfPassengers, flightId]
    );

    await client.query('COMMIT');
    
    res.status(201).json({
      booking: bookingResult.rows[0],
      itinerary: itineraryResult.rows[0]
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating booking and itinerary:', err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});
app.get("/api/itineraries/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    console.log("Fetching itineraries for userId:", userId);

    const query = `
      SELECT 
        i.itineraryid,
        i.seatnumber,
        i.gatenumber,
        i.baggageinfo,
        i.departuredatetime,
        i.arrivaldatetime,
        f.flightnumber,
        da.airportname AS departureairport,
        da.airportcode AS departurecode,
        aa.airportname AS arrivalairport,
        aa.airportcode AS arrivalcode,
        al.airlinename,
        b.bookingstatus
      FROM itinerary i
      JOIN booking b ON i.bookingid = b.bookingid
      JOIN flight f ON i.flightid = f.flightid
      JOIN airport da ON f.departureairport = da.airportid
      JOIN airport aa ON f.arrivalairport = aa.airportid
      JOIN airline al ON f.airlineid = al.airlineid
      WHERE b.userid = $1
      ORDER BY i.departuredatetime DESC;
    `;

    console.log("Executing query:", query);
    const result = await pool.query(query, [userId]);

    console.log("Itineraries fetched:", result.rows);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Failed to fetch itineraries:", err);
    res.status(500).json({ error: "Failed to fetch itineraries" });
  }
});




const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

