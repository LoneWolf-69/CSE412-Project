import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlane, FaCalendarAlt, FaUser } from 'react-icons/fa';
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
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    setSuccess('');
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
        setSuccess('Flights found successfully!');
      } else {
        setError('No flights found for the selected criteria.');
      }
    } catch (err) {
      setError('Error retrieving flights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = (flight) => {
    navigate('/booking', { 
      state: { 
        flightDetails: {
          flightid: flight.flightid,
          flightNumber: flight.flightnumber,
          departureCode: flight.departure_code,
          arrivalCode: flight.arrival_code,
          departureTime: flight.departuredatetime,
          arrivalTime: flight.arrivaldatetime,
          price: flight.price,
        }
      } 
    });
  };

  return (
    <div className="flight-search-container">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flight-search-header"
      >
        <h1>Elegant Journeys</h1>
        <p>Discover Your Perfect Flight</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flight-search-content"
      >
        <div className="flight-search-form">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="from"><FaPlane /> From</label>
                <select
                  id="from"
                  name="from"
                  value={searchData.from}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select departure</option>
                  {airports.map((airport) => (
                    <option key={airport.airportid} value={`${airport.airportname} (${airport.airportcode})`}>
                      {airport.airportname} ({airport.airportcode})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="to"><FaPlane /> To</label>
                <select
                  id="to"
                  name="to"
                  value={searchData.to}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select arrival</option>
                  {airports.map((airport) => (
                    <option key={airport.airportid} value={`${airport.airportname} (${airport.airportcode})`}>
                      {airport.airportname} ({airport.airportcode})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="departDate"><FaCalendarAlt /> Depart</label>
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
                <label htmlFor="returnDate"><FaCalendarAlt /> Return (Optional)</label>
                <input
                  type="date"
                  id="returnDate"
                  name="returnDate"
                  value={searchData.returnDate}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="passengers"><FaUser /> Passengers</label>
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
              <div className="form-group">
                <button type="submit" className="search-button" disabled={loading}>
                  {loading ? 'Searching...' : 'Find Flights'}
                </button>
              </div>
            </div>
          </form>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
        </div>
        <AnimatePresence>
          {flights.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="results-container"
            >
              {flights.map((flight) => (
                <motion.div
                  key={flight.flightid}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="flight-card"
                >
                  <div className="flight-card-header">
                    <h3>{flight.airline_name}</h3>
                    <span className="flight-number">Flight {flight.flightnumber}</span>
                  </div>
                  <div className="flight-card-body">
                    <div className="flight-route">
                      <div className="flight-point">
                        <span className="airport-code">{flight.departure_code}</span>
                        <span className="airport-name">{flight.departure_airport}</span>
                        <span className="flight-time">{new Date(flight.departuredatetime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <div className="flight-duration">
                        <span className="duration-line"></span>
                        <span className="duration-text">{Math.round((new Date(flight.arrivaldatetime) - new Date(flight.departuredatetime)) / 60000)} min</span>
                      </div>
                      <div className="flight-point">
                        <span className="airport-code">{flight.arrival_code}</span>
                        <span className="airport-name">{flight.arrival_airport}</span>
                        <span className="flight-time">{new Date(flight.arrivaldatetime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                    </div>
                    <div className="flight-price">
                      <span className="price-amount">${flight.price}</span>
                      <button className="book-button" onClick={() => handleBooking(flight)}>Select</button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default FlightSearch;

