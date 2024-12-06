import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { CreditCard, ShoppingCart, Plane, Calendar, Clock, DollarSign } from 'lucide-react'
import './BookingScreen.css'

function BookingScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { flightDetails } = location.state || {}
  const [paymentMethod, setPaymentMethod] = useState('credit-card')
  const [bookingError, setBookingError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  console.log('Flight details:', flightDetails)

  const handleBooking = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    setBookingError('')
    try {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        throw new Error('User ID not found. Please log in again.')
      }
      console.log('Sending booking request with:', {
        userId,
        flightId: flightDetails.flightid,
        numberOfPassengers: 1
      })
      const response = await axios.post('http://localhost:5001/api/bookings', {
        userId: userId,
        flightId: flightDetails.flightid,
        numberOfPassengers: 1
      })
      console.log('Booking response:', response.data)
      navigate('/dashboard')
    } catch (error) {
      console.error('Booking failed', error.response ? error.response.data : error.message)
      setBookingError(error.response ? error.response.data.error : error.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!flightDetails) {
    return (
      <div className="booking-screen">
        <div className="booking-card error-card">
          <h2>Oops! Something went wrong</h2>
          <p>No flight details available. Please select a flight first.</p>
          <button onClick={() => navigate('/flights')} className="back-button">
            Back to Flight Search
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="booking-screen">
      <div className="booking-card">
        <div className="booking-header">
          <h2>Book Your Flight</h2>
          <p>Complete your booking for flight {flightDetails.flightnumber}</p>
        </div>
        <div className="flight-summary">
          <div className="flight-info">
            <Plane className="icon" />
            <span>{flightDetails.departurecode} to {flightDetails.arrivalcode}</span>
          </div>
          <div className="flight-info">
            <Calendar className="icon" />
            <span>{new Date(flightDetails.departuredatetime).toLocaleDateString()}</span>
          </div>
          <div className="flight-info">
            <Clock className="icon" />
            <span>{new Date(flightDetails.departuredatetime).toLocaleTimeString()}</span>
          </div>
          <div className="flight-info">
            <DollarSign className="icon" />
            <span>${flightDetails.price}</span>
          </div>
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
              <div className="payment-options">
                <button
                  type="button"
                  className={`payment-option ${paymentMethod === 'credit-card' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('credit-card')}
                >
                  <CreditCard className="icon" />
                  <span>Credit Card</span>
                </button>
                <button
                  type="button"
                  className={`payment-option ${paymentMethod === 'paypal' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('paypal')}
                >
                  <ShoppingCart className="icon" />
                  <span>PayPal</span>
                </button>
              </div>
            </div>
            {paymentMethod === 'credit-card' && (
              <div className="credit-card-fields">
                <div className="form-group">
                  <label htmlFor="card-number">Card Number</label>
                  <input id="card-number" placeholder="1234 5678 9012 3456" required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="expiry">Expiry Date</label>
                    <input id="expiry" placeholder="MM/YY" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cvv">CVV</label>
                    <input id="cvv" placeholder="123" required />
                  </div>
                </div>
              </div>
            )}
            <div className="booking-footer">
              <div className="price-info">
                <p className="total-price">${flightDetails.price}</p>
                <p className="price-label">Total Price</p>
              </div>
              <button type="submit" className="confirm-button" disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Confirm Booking'}
              </button>
            </div>
          </form>
          {bookingError && <p className="error">{bookingError}</p>}
        </div>
      </div>
    </div>
  )
}

export default BookingScreen

