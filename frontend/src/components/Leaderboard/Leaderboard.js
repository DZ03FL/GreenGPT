import React, { useState, useEffect } from 'react';
import './Leaderboard.css';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [timeframe, setTimeframe] = useState('week'); // 'day' or 'week'

  useEffect(() => {
    // Placeholder: Simulate fetching leaderboard data
    const sampleData = [
      { name: 'Name', energySaved: 42 },
      { name: 'Name', energySaved: 35 },
      { name: 'Name', energySaved: 28 },
      { name: 'Name', energySaved: 24 },
      { name: 'Name', energySaved: 18 },
    ];
    setLeaderboardData(sampleData);
  }, [timeframe]);

  return (
    <div className="leaderboard-container">
      <h1>GreenGPT Leaderboard</h1>
      <p>See how you and your friends are conserving energy while chatting with GPT!</p>
    </div>
  );
};

export default Leaderboard;
