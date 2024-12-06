import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios';
import './BookingScreen.css'

function BookingScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { flightDetails } = location.state || {}
  const [paymentMethod, setPaymentMethod] = useState('credit-card')
  const [bookingError, setBookingError] = useState('')

  console.log('Flight details:', flightDetails);

  const handleBooking = async (event) => {
    event.preventDefault()
    try {
      // Assuming you have the user ID stored in localStorage after login
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found. Please log in again.');
      }
      console.log('Sending booking request with:', {
        userId,
        flightId: flightDetails.flightid,
        numberOfPassengers: 1
      });
      const response = await axios.post('http://localhost:5001/api/bookings', {
        userId: userId,
        flightId: flightDetails.flightid,
        numberOfPassengers: 1 // You might want to make this dynamic
      });
      console.log('Booking response:', response.data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Booking failed', error.response ? error.response.data : error.message);
      setBookingError(error.response ? error.response.data.error : error.message);
    }
  }

  if (!flightDetails) {
    return <div>No flight details available. Please select a flight first.</div>
  }

  return (
    <div className="booking-screen">
      <div className="booking-card">
        <div className="booking-header">
          <h2>Book Your Flight</h2>
          <p>Complete your booking for flight {flightDetails.flightNumber}</p>
        </div>
        <div className="booking-content">
          <form onSubmit={handleBooking}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input id="name" placeholder="John Doe" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input id="email" placeholder="john@example.com" type="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="passport">Passport Number</label>
              <input id="passport" placeholder="A1234567" required />
            </div>
            <div className="form-group">
              <label>Payment Method</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    value="credit-card"
                    checked={paymentMethod === 'credit-card'}
                    onChange={() => setPaymentMethod('credit-card')}
                  />
                  Credit Card
                </label>
                <label>
                  <input
                    type="radio"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={() => setPaymentMethod('paypal')}
                  />
                  PayPal
                </label>
              </div>
            </div>
            {paymentMethod === 'credit-card' && (
              <>
                <div className="form-group">
                  <label htmlFor="card-number">Card Number</label>
                  <input id="card-number" placeholder="1234 5678 9012 3456" required />
                </div>
                <div className="form-group">
                  <label htmlFor="expiry">Expiry Date</label>
                  <input id="expiry" placeholder="MM/YY" required />
                </div>
                <div className="form-group">
                  <label htmlFor="cvv">CVV</label>
                  <input id="cvv" placeholder="123" required />
                </div>
              </>
            )}
            <div className="booking-footer">
              <div className="price-info">
                <p className="total-price">${flightDetails.price}</p>
                <p className="price-label">Total Price</p>
              </div>
              <button type="submit" className="confirm-button">Confirm Booking</button>
            </div>
          </form>
          {bookingError && <p className="error">{bookingError}</p>}
        </div>
      </div>
    </div>
  )
}

export default BookingScreen

