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
      <h1> Leaderboard</h1>
      <p>See how you and your friends are conserving energy while chatting with GPT!</p>

      <div className="timeframe-toggle">
        <button
          className={timeframe === 'day' ? 'active' : ''}
          onClick={() => setTimeframe('day')}
        >
          Daily
        </button>
        <button
          className={timeframe === 'week' ? 'active' : ''}
          onClick={() => setTimeframe('week')}
        >
          Weekly
        </button>
      </div>

      <div className="leaderboard">
        {leaderboardData.length === 0 ? (
          <p>No data available.</p>
        ) : (
          <ol className="leaderboard-list">
            {leaderboardData.map((user, index) => (
              <li key={index} className="leaderboard-item">
                <span className="user-rank">#{index + 1}</span>
                <span className="user-name">{user.name}</span>
                <span className="energy-saved">{user.energySaved} kWh saved</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
