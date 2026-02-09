import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { routeAPI, bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './BookingPage.css';

const BookingPage = () => {
  const { routeId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [route, setRoute] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [boardingPoint, setBoardingPoint] = useState('');
  const [droppingPoint, setDroppingPoint] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to book tickets');
      navigate('/login');
      return;
    }
    fetchRoute();
  }, [routeId, isAuthenticated]);

  const fetchRoute = async () => {
    try {
      const response = await routeAPI.getRoute(routeId);
      setRoute(response.data.data);
      if (response.data.data.boardingPoints?.length > 0) {
        setBoardingPoint(response.data.data.boardingPoints[0].location);
      }
      if (response.data.data.droppingPoints?.length > 0) {
        setDroppingPoint(response.data.data.droppingPoints[0].location);
      }
    } catch (error) {
      toast.error('Failed to load route details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (seatNumber) => {
    if (route.bookedSeats.includes(seatNumber)) return;

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
      setPassengers(passengers.filter(p => p.seatNumber !== seatNumber));
    } else {
      if (selectedSeats.length >= 6) {
        toast.error('Maximum 6 seats can be selected');
        return;
      }
      setSelectedSeats([...selectedSeats, seatNumber]);
      setPassengers([...passengers, { seatNumber, name: '', age: '', gender: 'Male' }]);
    }
  };

  const updatePassenger = (seatNumber, field, value) => {
    setPassengers(passengers.map(p => 
      p.seatNumber === seatNumber ? { ...p, [field]: value } : p
    ));
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }

    const incompletePassenger = passengers.find(p => !p.name || !p.age);
    if (incompletePassenger) {
      toast.error('Please fill all passenger details');
      return;
    }

    try {
      const bookingData = {
        routeId,
        passengerDetails: passengers,
        boardingPoint: { location: boardingPoint },
        droppingPoint: { location: droppingPoint },
        paymentMethod: 'credit_card'
      };

      const response = await bookingAPI.createBooking(bookingData);
      toast.success('Booking confirmed!');
      navigate(`/booking-confirmation/${response.data.data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!route) return null;

  const totalSeats = route.bus.totalSeats;
  const rows = Math.ceil(totalSeats / 4);

  return (
    <div className="booking-page">
      <div className="booking-container">
        <div className="bus-details">
          <h2>{route.bus.busName}</h2>
          <p>{route.fromCity} → {route.toCity}</p>
          <p>Date: {new Date(route.date).toLocaleDateString()}</p>
          <p>{route.departureTime} - {route.arrivalTime}</p>
        </div>

        <div className="seat-selection">
          <h3>Select Seats</h3>
          <div className="seat-legend">
            <span><div className="seat available"></div> Available</span>
            <span><div className="seat selected"></div> Selected</span>
            <span><div className="seat booked"></div> Booked</span>
          </div>
          
          <div className="bus-layout">
            <div className="driver">🚗 Driver</div>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <div key={rowIndex} className="seat-row">
                {Array.from({ length: 4 }).map((_, colIndex) => {
                  const seatNumber = rowIndex * 4 + colIndex + 1;
                  if (seatNumber > totalSeats) return null;
                  
                  const isBooked = route.bookedSeats.includes(seatNumber);
                  const isSelected = selectedSeats.includes(seatNumber);
                  
                  return (
                    <div
                      key={seatNumber}
                      className={`seat ${isBooked ? 'booked' : isSelected ? 'selected' : 'available'} ${colIndex === 1 ? 'aisle-after' : ''}`}
                      onClick={() => handleSeatClick(seatNumber)}
                    >
                      {seatNumber}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {selectedSeats.length > 0 && (
          <div className="passenger-details">
            <h3>Passenger Details</h3>
            {passengers.map((passenger, index) => (
              <div key={passenger.seatNumber} className="passenger-form">
                <h4>Seat {passenger.seatNumber}</h4>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={passenger.name}
                    onChange={(e) => updatePassenger(passenger.seatNumber, 'name', e.target.value)}
                    className="form-input"
                  />
                  <input
                    type="number"
                    placeholder="Age"
                    value={passenger.age}
                    onChange={(e) => updatePassenger(passenger.seatNumber, 'age', e.target.value)}
                    className="form-input"
                  />
                  <select
                    value={passenger.gender}
                    onChange={(e) => updatePassenger(passenger.seatNumber, 'gender', e.target.value)}
                    className="form-input"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            ))}

            <div className="boarding-points">
              <div className="form-group">
                <label>Boarding Point</label>
                <select value={boardingPoint} onChange={(e) => setBoardingPoint(e.target.value)} className="form-input">
                  {route.boardingPoints?.map((point, index) => (
                    <option key={index} value={point.location}>{point.location} - {point.time}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Dropping Point</label>
                <select value={droppingPoint} onChange={(e) => setDroppingPoint(e.target.value)} className="form-input">
                  {route.droppingPoints?.map((point, index) => (
                    <option key={index} value={point.location}>{point.location} - {point.time}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {selectedSeats.length > 0 && (
          <div className="booking-summary">
            <h3>Booking Summary</h3>
            <div className="summary-row">
              <span>Seats Selected:</span>
              <span>{selectedSeats.join(', ')}</span>
            </div>
            <div className="summary-row">
              <span>Number of Passengers:</span>
              <span>{selectedSeats.length}</span>
            </div>
            <div className="summary-row">
              <span>Price per Seat:</span>
              <span>₹{route.price}</span>
            </div>
            <div className="summary-row total">
              <span>Total Amount:</span>
              <span>₹{route.price * selectedSeats.length}</span>
            </div>
            <button className="confirm-button" onClick={handleBooking}>
              Proceed to Payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
