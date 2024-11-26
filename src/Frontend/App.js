import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import FlightSearch from './FlightSearch';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Welcome to Flight Booking System</h1>
          <p>
            Book flights effortlessly and manage your journeys with ease.
          </p>
          <div className="buttons">
            <Link to="/search-flights" className="btn">
              Search Flights
            </Link>
            <Link to="/manage-bookings" className="btn">
              Manage Bookings
            </Link>
            <Link to="/contact-support" className="btn">
              Contact Support
            </Link>
          </div>
        </header>

        <Routes>
          <Route path="/search-flights" element={<FlightSearch />} />
          {/* Add other routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;