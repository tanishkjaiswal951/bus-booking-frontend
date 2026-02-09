import React, { useState, useEffect } from 'react';
import { bookingAPI } from '../services/api';
import { toast } from 'react-toastify';
import './MyBookings.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getMyBookings();
      setBookings(response.data.data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingAPI.cancelBooking(bookingId);
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      confirmed: 'status-confirmed',
      cancelled: 'status-cancelled',
      pending: 'status-pending'
    };
    return <span className={`status-badge ${statusClasses[status]}`}>{status.toUpperCase()}</span>;
  };

  if (loading) return <div className="loading">Loading bookings...</div>;

  return (
    <div className="my-bookings">
      <div className="bookings-container">
        <h2>My Bookings</h2>
        
        {bookings.length === 0 ? (
          <div className="no-bookings">
            <h3>No bookings found</h3>
            <p>You haven't made any bookings yet</p>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <div key={booking._id} className="booking-card">
                <div className="booking-header">
                  <div>
                    <h3>{booking.route.bus.busName}</h3>
                    <p className="route-info">
                      {booking.route.fromCity} → {booking.route.toCity}
                    </p>
                  </div>
                  {getStatusBadge(booking.bookingStatus)}
                </div>

                <div className="booking-details">
                  <div className="detail-row">
                    <span className="label">Booking Reference:</span>
                    <span className="value">{booking.bookingReference}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Journey Date:</span>
                    <span className="value">{new Date(booking.route.date).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Time:</span>
                    <span className="value">{booking.route.departureTime} - {booking.route.arrivalTime}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Seats:</span>
                    <span className="value">
                      {booking.passengerDetails.map(p => p.seatNumber).join(', ')}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Passengers:</span>
                    <span className="value">{booking.passengerDetails.length}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Total Amount:</span>
                    <span className="value amount">₹{booking.totalAmount}</span>
                  </div>
                </div>

                <div className="passenger-list">
                  <h4>Passenger Details</h4>
                  {booking.passengerDetails.map((passenger, index) => (
                    <div key={index} className="passenger-item">
                      <span>Seat {passenger.seatNumber}:</span>
                      <span>{passenger.name}, {passenger.age}yrs, {passenger.gender}</span>
                    </div>
                  ))}
                </div>

                {booking.bookingStatus === 'confirmed' && (
                  <button 
                    className="cancel-button"
                    onClick={() => handleCancelBooking(booking._id)}
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
