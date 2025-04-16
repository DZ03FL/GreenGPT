import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: email,
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setEmail('');
        setUsername('');
        setPassword('');
        setSuccessMsg('Registration successful! You can now log in.');
      } 
      else {
        setErrorMsg(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrorMsg('Something went wrong with registration.');
    }
  };

  return (
    <div className="signup-container">
        {/* Left Column: Signup Form */}
      <div className="signup-left">
        <h2>Create Your Account</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          {errorMsg && <p className="error">{errorMsg}</p>}
          {successMsg && <p className="success">{successMsg}</p>}
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="signup-button">Sign Up</button>
        </form>
      </div>

        {/* Right Column: Login Section */}  
      <div className="signup-right">
        <h2>Already a Member?</h2>
        <p>Log in to set and track your energy usage goals with GreenGPT.</p>
        <button className="login-button" onClick={() => navigate('/login')}>
          Login
        </button>
      </div>
    </div>
  );
};

export default Signup;
