import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('profile');
  const [userProfile, setUserProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetchUserProfile(userId);
      fetchUserBookings(userId);
      fetchUserItineraries(userId);
    }
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/users/${userId}`);
      setUserProfile(response.data);
    } catch (error) {
      console.error('Failed to fetch user profile', error);
      setError('Failed to fetch user profile');
    }
  };

  const fetchUserBookings = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/bookings/${userId}`);
      setBookings(response.data);
    } catch (error) {
      console.error('Failed to fetch user bookings', error);
      setError('Failed to fetch bookings');
    }
  };

  const fetchUserItineraries = async (userId) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5001/api/itineraries/${userId}`);
      console.log('Fetched itineraries:', response.data);
      setItineraries(response.data);
    } catch (error) {
      console.error('Failed to fetch user itineraries', error);
      setError('Failed to fetch itineraries');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <button 
          onClick={() => setActiveTab('profile')} 
          className={activeTab === 'profile' ? 'active' : ''}
        >
          Profile
        </button>
        <button 
          onClick={() => setActiveTab('bookings')} 
          className={activeTab === 'bookings' ? 'active' : ''}
        >
          Bookings
        </button>
        <button 
          onClick={() => setActiveTab('itinerary')} 
          className={activeTab === 'itinerary' ? 'active' : ''}
        >
          Itinerary
        </button>
        <button 
          onClick={() => navigate("/flights")} 
          className="flight-search-button"
        >
          Flight Search
        </button>
      </nav>

      <div className="dashboard-content">
        {error && <div className="error-message">{error}</div>}
        
        {activeTab === 'profile' && userProfile && (
          <div className="profile">
            <h2>User Profile</h2>
            <p><strong>Name:</strong> {userProfile.firstname} {userProfile.lastname}</p>
            <p><strong>Email:</strong> {userProfile.email}</p>
            <p><strong>Phone:</strong> {userProfile.phonenumber || 'Not provided'}</p>
            <p><strong>Address:</strong> {userProfile.address || 'Not provided'}</p>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bookings">
            <h2>Your Bookings</h2>
            {bookings.length === 0 ? (
              <p>No bookings found. Start by searching for flights!</p>
            ) : (
              bookings.map(booking => (
                <div key={booking.bookingid} className="booking-item">
                  <p><strong>Booking ID:</strong> {booking.bookingid}</p>
                  <p><strong>Flight:</strong> {booking.flightnumber}</p>
                  <p><strong>From:</strong> {booking.departureairport}</p>
                  <p><strong>To:</strong> {booking.arrivalairport}</p>
                  <p><strong>Departure:</strong> {formatDateTime(booking.departuredatetime)}</p>
                  <p><strong>Arrival:</strong> {formatDateTime(booking.arrivaldatetime)}</p>
                  <p><strong>Status:</strong> {booking.bookingstatus}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'itinerary' && (
          <div className="itinerary">
            <h2>Your Itineraries</h2>
            {loading ? (
              <p>Loading itineraries...</p>
            ) : itineraries.length === 0 ? (
              <div className="no-itineraries">
                <p>No itineraries found.</p>
                <p>Book a flight to see your itinerary here!</p>
                <button 
                  onClick={() => navigate('/flights')} 
                  className="search-flights-btn"
                >
                  Search Flights
                </button>
              </div>
            ) : (
              <div className="itineraries-list">
                {itineraries.map(itinerary => (
                  <div key={itinerary.itineraryid} className="itinerary-item">
                    <div className="itinerary-header">
                      <h3>{itinerary.airlinename} - Flight {itinerary.flightnumber}</h3>
                      <span className="status-badge">{itinerary.bookingstatus}</span>
                    </div>
                    <div className="itinerary-details">
                      <div className="flight-info">
                        <div className="departure">
                          <p className="airport-code">{itinerary.departurecode}</p>
                          <p className="airport-name">{itinerary.departureairport}</p>
                          <p className="time">{formatDateTime(itinerary.departuredatetime)}</p>
                        </div>
                        <div className="flight-duration">
                          <span className="arrow">→</span>
                        </div>
                        <div className="arrival">
                          <p className="airport-code">{itinerary.arrivalcode}</p>
                          <p className="airport-name">{itinerary.arrivalairport}</p>
                          <p className="time">{formatDateTime(itinerary.arrivaldatetime)}</p>
                        </div>
                      </div>
                      <div className="travel-details">
                        <p><strong>Seat:</strong> {itinerary.seatnumber}</p>
                        <p><strong>Gate:</strong> {itinerary.gatenumber}</p>
                        <p><strong>Baggage:</strong> {itinerary.baggageinfo}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <Link to="/flights" className="back-to-search">
        Back to Flight Search
      </Link>
    </div>
  );
}

export default Dashboard;

