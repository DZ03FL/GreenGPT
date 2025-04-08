import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <div className="headerContainer">
      <Link to="/" className="headerGreenGPT">GreenGPT</Link>
      <div className="nav-links">
        <Link to="/download" className="headerAbout">Download</Link>
        <Link to="/goals" className="headerAbout">Set Goals</Link>
        <Link to="/leaderboard" className="headerAbout">Leaderboard</Link>
        <Link to="/view-data" className="headerAbout">View Data</Link>
      </div>
      <Link to="/login" className="headerAbout">Login</Link>
    </div>
  );
};

export default Header;