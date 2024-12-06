import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('profile');
  const [userProfile, setUserProfile] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetchUserProfile(userId);
      fetchUserBookings(userId);
    }
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/users/${userId}`);
      setUserProfile(response.data);
    } catch (error) {
      console.error('Failed to fetch user profile', error);
    }
  };

  const fetchUserBookings = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/bookings/${userId}`);
      setBookings(response.data);
    } catch (error) {
      console.error('Failed to fetch user bookings', error);
    }
  };

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <button onClick={() => setActiveTab('profile')} className={activeTab === 'profile' ? 'active' : ''}>Profile</button>
        <button onClick={() => setActiveTab('bookings')} className={activeTab === 'bookings' ? 'active' : ''}>Bookings</button>
        <button onClick={() => setActiveTab('itinerary')} className={activeTab === 'itinerary' ? 'active' : ''}>Itinerary</button>
      </nav>
      <div className="dashboard-content">
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
            {bookings.map(booking => (
              <div key={booking.bookingid} className="booking-item">
                <p><strong>Booking ID:</strong> {booking.bookingid}</p>
                <p><strong>Flight:</strong> {booking.flightnumber}</p>
                <p><strong>From:</strong> {booking.departureairport}</p>
                <p><strong>To:</strong> {booking.arrivalairport}</p>
                <p><strong>Departure:</strong> {new Date(booking.departuredatetime).toLocaleString()}</p>
                <p><strong>Arrival:</strong> {new Date(booking.arrivaldatetime).toLocaleString()}</p>
                <p><strong>Status:</strong> {booking.bookingstatus}</p>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'itinerary' && (
          <div className="itinerary">
            <h2>Your Itinerary</h2>
            <p>Itinerary details will be displayed here.</p>
          </div>
        )}
      </div>
      <Link to="/" className="back-to-search">Back to Flight Search</Link>
    </div>
  );
}

export default Dashboard;

