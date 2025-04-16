import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import AuthContext from '../../context/AuthContext';

const Login = () => {
  const { setIsLoggedIn } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          identifier: email,
          password: password,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok && data.success) {
        setIsLoggedIn(true);
        navigate('/goals');
      } 
      else {
        setErrorMsg(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMsg('Something went wrong.');
    }
  };

  return (
    <div className="login-container">
      {/* Left Column: Login Form */}
      <div className="login-left">
        <h2>Login to Your Account</h2>
        <form onSubmit={handleSubmit} className="login-form">
          {errorMsg && <p className="error">{errorMsg}</p>}
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="text"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button">Sign In</button>
        </form>
      </div>

      {/* Right Column: Sign Up Section */}
      <div className="login-right">
        <h2>New Here?</h2>
        <p>
          Sign up now and join the GreenGPT community to discover personalized tips, challenges, and rewards
          for optimizing your energy usage.
        </p>
        <button className="signup-button" onClick={() => navigate('/signup')}>
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Login;