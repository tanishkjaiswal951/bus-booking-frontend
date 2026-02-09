import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { routeAPI } from '../services/api';
import { toast } from 'react-toastify';
import './SearchResults.css';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    searchRoutes();
  }, [searchParams]);

  const searchRoutes = async () => {
    try {
      const params = {
        fromCity: searchParams.get('from'),
        toCity: searchParams.get('to'),
        date: searchParams.get('date')
      };
      
      const response = await routeAPI.searchRoutes(params);
      setRoutes(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to search routes');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (route) => {
    navigate(`/booking/${route._id}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Searching buses...</div>;
  }

  return (
    <div className="search-results">
      <div className="search-header">
        <h2>
          {searchParams.get('from')} → {searchParams.get('to')}
        </h2>
        <p>{formatDate(searchParams.get('date'))} • {routes.length} buses found</p>
      </div>

      {routes.length === 0 ? (
        <div className="no-results">
          <h3>No buses found</h3>
          <p>Try searching for different cities or dates</p>
        </div>
      ) : (
        <div className="routes-list">
          {routes.map((route) => (
            <div key={route._id} className="route-card">
              <div className="route-header">
                <div className="bus-info">
                  <h3>{route.bus.busName}</h3>
                  <p className="bus-type">{route.bus.busType}</p>
                  <p className="operator">{route.bus.operatorName}</p>
                </div>
                <div className="route-timing">
                  <div className="time-point">
                    <span className="time">{route.departureTime}</span>
                    <span className="city">{route.fromCity}</span>
                  </div>
                  <div className="duration">
                    <span className="duration-line"></span>
                    <span className="duration-text">{route.duration}</span>
                  </div>
                  <div className="time-point">
                    <span className="time">{route.arrivalTime}</span>
                    <span className="city">{route.toCity}</span>
                  </div>
                </div>
              </div>

              <div className="route-details">
                <div className="amenities">
                  {route.bus.amenities?.slice(0, 3).map((amenity, index) => (
                    <span key={index} className="amenity-tag">{amenity}</span>
                  ))}
                </div>
                <div className="seats-info">
                  <span className="seats-available">{route.availableSeats} seats available</span>
                </div>
              </div>

              <div className="route-footer">
                <div className="price-section">
                  <span className="price-label">Starting from</span>
                  <span className="price">₹{route.price}</span>
                </div>
                <button 
                  className="book-button"
                  onClick={() => handleBookNow(route)}
                  disabled={route.availableSeats === 0}
                >
                  {route.availableSeats === 0 ? 'Sold Out' : 'Book Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
