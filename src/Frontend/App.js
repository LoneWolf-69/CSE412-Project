import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./Auth/Register";
import Login from "./Auth/Login";
import FlightSearch from "./Flights/FlightSearch";
import BookingScreen from "./Bookings/BookingScreen";
import Dashboard from "./Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace={true} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/flights" element={<FlightSearch />} />
        <Route path="/booking" element={<BookingScreen />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;