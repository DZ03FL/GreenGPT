// src/components/Header/Header.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check localStorage for token on mount and when storage changes.
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // Optional: you can use a custom event or context to update login state
  // For a simple approach, we check localStorage when the header mounts.

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/'); // Navigate to home or login as needed
  };

  return (
    <div className="headerContainer">
      <Link to="/" className="headerGreenGPT">GreenGPT</Link>
      <div>
        <Link to="/download" className="headerAbout">Download</Link>
        <Link to="/set-goals" className="headerAbout">Set Goals</Link>
        <Link to="/leaderboard" className="headerAbout">Leaderboard</Link>
        <Link to="/view-data" className="headerAbout">View Data</Link>
      </div>
      {/* Conditionally render the Sign Out button or Login link */}
      {isLoggedIn ? (
        <button onClick={handleLogout} className="headerAbout signOutButton">
          Sign Out
        </button>
      ) : (
        <Link to="/login" className="headerAbout">Login</Link>
      )}
    </div>
  );
};

export default Header;
