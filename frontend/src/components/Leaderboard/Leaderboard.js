import React, { useState, useEffect } from 'react';
import './Leaderboard.css';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/leaderboard', {
          credentials: 'include'
        });
        const data = await res.json();
        setLeaderboardData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setLeaderboardData([]);
      }
    };
    fetchBoard();
  }, []);

  return (
    <div className="leaderboard-container">
      <h1>Leaderboard</h1>
      <p>Top conservers this month (lowest kWh used)</p>
      <div className="leaderboard">
        {leaderboardData.length === 0
          ? <p>No data available.</p>
          : (
            <ol className="leaderboard-list">
              {leaderboardData.map((user, idx) => (
                <li key={user.name + idx} className="leaderboard-item">
                  <span className="user-rank">#{idx + 1}</span>
                  <span className="user-name">{user.name}</span>
                  <span className="energy-saved">{user.energySaved} kWh</span>
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