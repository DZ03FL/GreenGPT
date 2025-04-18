import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Checks if the user is logged in by making a request to the backend

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const res = await fetch('https://greengpt.onrender.com/api/auth/status', {
          method: 'GET',
          credentials: 'include',
        });

        const data = await res.json();
        setIsLoggedIn(data.authenticated);
      } catch (err) {
        console.error('Error checking login status:', err);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
