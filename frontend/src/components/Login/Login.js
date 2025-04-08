import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Test values: Update these as needed.
    const testIdentifier = 'testuser';
    const testPassword = 'password123';

    if (identifier === testIdentifier && password === testPassword) {
      // Simulate storing an authentication token
      localStorage.setItem('token', 'dummy-jwt-token');
      // Redirect to the home page (or any desired route)
      navigate('/');
    } else {
      setErrorMsg('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="login-container">
      {/* Left column: Login form */}
      <div className="login-left">
        <h2>Login to Your Account</h2>
        <form onSubmit={handleSubmit} className="login-form">
          {errorMsg && <p className="error">{errorMsg}</p>}
          <label htmlFor="identifier">
            Username:
            <input
              id="identifier"
              type="text"
              placeholder="Enter your username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </label>
          <label htmlFor="password">
            Password:
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="login-button">Sign In</button>
        </form>
      </div>

      {/* Right column: Sign-up prompt */}
      <div className="login-right">
        <h2>New Here?</h2>
        <p>Sign up and discover your GPT energy consumption insights!</p>
        <button className="signup-button" onClick={() => navigate('/signup')}>
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Login;
