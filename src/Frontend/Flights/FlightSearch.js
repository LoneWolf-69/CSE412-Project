import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FlightSearch.css';

function FlightSearch() {
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    departDate: '',
    returnDate: '',
    passengers: '1',
  });

  const [airports, setAirports] = useState([]);
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/airports');
        setAirports(response.data);
      } catch (err) {
        setError('Error loading airports. Please refresh the page.');
      }
    };
    fetchAirports();
  }, []);

  const handleChange = (e) => {
    setSearchData({ ...searchData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFlights([]);
    setLoading(true);

    try {
      const fromCode = searchData.from.split('(')[1].replace(')', '');
      const toCode = searchData.to.split('(')[1].replace(')', '');

      const response = await axios.get('http://localhost:5001/api/flights', {
        params: {
          from: fromCode,
          to: toCode,
          departDate: searchData.departDate,
          passengers: searchData.passengers,
        },
      });

      if (response.data.flights && response.data.flights.length > 0) {
        setFlights(response.data.flights);
      } else {
        setError('No flights found for the selected criteria.');
      }
    } catch (err) {
      setError('Error retrieving flights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flight-search-container">
      <header className="flight-search-header">
        <div className="brand-title">✈️ Flight Finder</div>
      </header>
      <div className="search-box">
        <h1>Search for Your Perfect Flight</h1>
        <form className="search-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="from">From</label>
            <select
              id="from"
              name="from"
              value={searchData.from}
              onChange={handleChange}
              required
            >
              <option value="">Select departure airport</option>
              {airports.map((airport) => (
                <option key={airport.airportid} value={`${airport.airportname} (${airport.airportcode})`}>
                  {airport.airportname} ({airport.airportcode})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="to">To</label>
            <select
              id="to"
              name="to"
              value={searchData.to}
              onChange={handleChange}
              required
            >
              <option value="">Select arrival airport</option>
              {airports.map((airport) => (
                <option key={airport.airportid} value={`${airport.airportname} (${airport.airportcode})`}>
                  {airport.airportname} ({airport.airportcode})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="departDate">Depart</label>
            <input
              type="date"
              id="departDate"
              name="departDate"
              value={searchData.departDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="returnDate">Return (Optional)</label>
            <input
              type="date"
              id="returnDate"
              name="returnDate"
              value={searchData.returnDate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="passengers">Passengers</label>
            <select
              id="passengers"
              name="passengers"
              value={searchData.passengers}
              onChange={handleChange}
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num.toString()}>
                  {num}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="search-button" disabled={loading}>
            {loading ? 'Searching...' : 'Search Flights'}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
      <div className="results-container">
        {flights.map((flight) => (
          <div key={flight.flightid} className="flight-card">
            <h3>{flight.airline_name} - Flight {flight.flightnumber}</h3>
            <div className="flight-details">
              <p><strong>From:</strong> {flight.departure_airport}</p>
              <p><strong>To:</strong> {flight.arrival_airport}</p>
              <p><strong>Departure:</strong> {new Date(flight.departuredatetime).toLocaleString()}</p>
              <p><strong>Arrival:</strong> {new Date(flight.arrivaldatetime).toLocaleString()}</p>
              <p><strong>Price:</strong> ${flight.price}</p>
            </div>
            <button className="book-button">Book Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FlightSearch;