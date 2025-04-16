import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Landing from './components/Landing/Landing';
import Login from './components/Login/Login';
import Goals from './components/Goals/Goals';
import Signup from './components/Signup/Signup';
import Leaderboard from './components/Leaderboard/Leaderboard';
import Data from './components/Data/Data';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
      {/* Header is Persistent */}
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/leaderboard" element={<Leaderboard/>}/>
        <Route path="/view-data" element={<Data/>}/>
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
