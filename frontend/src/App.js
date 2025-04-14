import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Landing from './components/Landing/Landing';
import Login from './components/Login/Login';
import Goals from './components/Goals/Goals';
import Leaderboard from './components/Leaderboard/Leaderboard';

function App() {
  return (
    <Router>
      {/* Header is Persistent */}
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/leaderboard" element={<Leaderboard/>}/>
      </Routes>
    </Router>
  );
}

export default App;
