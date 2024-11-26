import React from 'react';
import './FlightSearch.css';

function FlightSearch() {
  console.log("FlightSearch Component Rendered");
  return (
    <div className="flight-search-container">
      <header className="flight-search-header">
        <div className="logo">Skyscanner</div>
        <nav>
          <button className="nav-button active">Flights</button>
          <button className="nav-button">Hotels</button>
          <button className="nav-button">Car Rental</button>
        </nav>
      </header>
      <div className="search-container">
        <h1>Millions of cheap flights. One simple search.</h1>
        <form className="search-form">
          <div className="form-group">
            <label>From</label>
            <input type="text" placeholder="Phoenix (Any)" />
          </div>
          <div className="form-group">
            <label>To</label>
            <input type="text" placeholder="Country, city or airport" />
          </div>
          <div className="form-group">
            <label>Depart</label>
            <input type="date" />
          </div>
          <div className="form-group">
            <label>Return</label>
            <input type="date" />
          </div>
          <div className="form-group">
            <label>Travelers and cabin class</label>
            <input type="text" placeholder="1 Adult, Economy" />
          </div>
          <button type="submit" className="search-button">Search</button>
        </form>
      </div>
    </div>
  );
}

export default FlightSearch;