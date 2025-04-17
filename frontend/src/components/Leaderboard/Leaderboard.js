import React, { useState, useEffect } from 'react';
import './Leaderboard.css';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const API = 'http://localhost:5000/api/leaderboard';

  const fetchBoard = async () => {
    try {
      const res = await fetch(API, { credentials: 'include' });
      const data = await res.json();
      setLeaderboardData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setLeaderboardData([]);
    }
  };

  // 1) fetch on mount
  useEffect(() => {
    fetchBoard();
  }, []);

  return (
    <div className="leaderboard-container">
      <h1>Friends Leaderboard</h1>
      <p>See how your friends are conserving energy this month!</p>
      <button onClick={fetchBoard} className="refresh-button">
        🔄 Refresh
      </button>

      <div className="leaderboard">
        {leaderboardData.length === 0
          ? <p>No friends data available.</p>
          : (
            <ol className="leaderboard-list">
              {leaderboardData.map((user, idx) => (
                <li key={user.name + idx} className="leaderboard-item">
                  <span className="user-rank">#{idx + 1}</span>
                  <span className="user-name">{user.name}</span>
                  <span className="energy-saved">
                    {user.energySaved} kWh
                  </span>
                </li>
              ))}
            </ol>
          )
        }
      </div>
    </div>
  );
};

export default Leaderboard;
