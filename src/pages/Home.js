import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    fromCity: '',
    toCity: '',
    date: ''
  });

  const handleChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchData.fromCity || !searchData.toCity || !searchData.date) {
      toast.error('Please fill all fields');
      return;
    }
    navigate(`/search?from=${searchData.fromCity}&to=${searchData.toCity}&date=${searchData.date}`);
  };

  return (
    <div className="home">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Book Your Bus Tickets Online</h1>
          <p className="hero-subtitle">Fast, Easy & Secure Booking</p>
          
          <form className="search-form" onSubmit={handleSearch}>
            <div className="form-row">
              <div className="form-group">
                <label>From</label>
                <input
                  type="text"
                  name="fromCity"
                  placeholder="Enter source city"
                  value={searchData.fromCity}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>To</label>
                <input
                  type="text"
                  name="toCity"
                  placeholder="Enter destination city"
                  value={searchData.toCity}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={searchData.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="form-input"
                />
              </div>
              
              <button type="submit" className="search-button">
                Search Buses
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="features-section">
        <div className="features-container">
          <div className="feature-card">
            <div className="feature-icon">🎫</div>
            <h3>Easy Booking</h3>
            <p>Book your tickets in just a few clicks</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💳</div>
            <h3>Secure Payment</h3>
            <p>Multiple payment options available</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🚌</div>
            <h3>Wide Network</h3>
            <p>Buses to all major cities</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3>Best Prices</h3>
            <p>Get the best deals on bus tickets</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
