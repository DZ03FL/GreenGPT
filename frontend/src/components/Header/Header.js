import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './Header.css';
import AuthContext from '../../context/AuthContext';

const Header = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);  
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        setIsLoggedIn(false);
        navigate('/');
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="headerContainer">
      <Link to="/" className="headerGreenGPT">GreenGPT</Link>
      <div className="nav-links">
        <Link to="/add-friend" className="headerAbout">Add Friend</Link>
        <Link to="/buddies" className="headerAbout">Buddy List</Link>
        <Link to="/goals" className="headerAbout">Set Goals</Link>
        <Link to="/leaderboard" className="headerAbout">Leaderboard</Link>
        <Link to="/view-data" className="headerAbout">View Data</Link>
      </div>
      {isLoggedIn ? (
        <Link to="/" className="headerAbout" onClick={handleLogout}>Logout</Link>
      ) : (
        <Link to="/login" className="headerAbout">Login</Link>
      )}
    </div>
  );
};

export default Header;