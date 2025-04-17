import React, { useState, useEffect } from 'react';
import './Goals.css';
import useAuthRedirect from '../../hooks/useAuthRedirect';

const Goals = () => {
  useAuthRedirect();

  const [measure, setMeasure] = useState('');
  const [duration, setDuration] = useState('');
  const [goals, setGoals] = useState([]);
  const [energyUsed, setEnergyUsed] = useState(0);

  const fetchGoals = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/goals', {
        credentials: 'include',
      });
      const data = await res.json();

      if (Array.isArray(data)) {
        const parsed = data.map(goal => ({
          id: goal.goal_id,
          measure: goal.energy_limit,
          duration: goal.duration,
          completed: goal.achieved || false,
        }));
        setGoals(parsed);
      } else {
        console.error('Invalid response from server:', data);
      }
    } catch (err) {
      console.error('Error fetching goals:', err);
    }
  };

  const fetchEnergyEstimate = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/energy-estimate', {
        credentials: 'include',
      });
      const data = await res.json();

      if (res.ok && typeof data.total_energy_used === 'number') {
        setEnergyUsed(data.total_energy_used);
      } else {
        console.error('Invalid energy estimate response:', data);
      }
    } catch (err) {
      console.error('Error fetching energy estimate:', err);
    }
  };

  useEffect(() => {
    fetchGoals();
    fetchEnergyEstimate();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const newGoal = {
      duration,
      energy_limit: parseFloat(measure),
    };

    try {
      const res = await fetch('http://localhost:5000/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newGoal),
      });

      if (res.ok) {
        setMeasure('');
        setDuration('');
        await fetchGoals();
        await fetchEnergyEstimate();
      } else {
        const data = await res.json();
        console.error('Goal creation failed:', data.error);
      }
    } catch (err) {
      console.error('Error posting goal:', err);
    }
  };

  const deleteGoal = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/goals/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        await fetchGoals();
        await fetchEnergyEstimate();
      } else {
        const data = await res.json();
        console.error('Delete failed:', data.error);
      }
    } catch (err) {
      console.error('Error deleting goal:', err);
    }
  };

  return (
    <div className="goals-container">
      <div className="goals-left">
        <div className="carousel"> <img src="/images/icon.jpg" alt="Icon" className="goal-icon" /></div>
        <h2>Set New Energy Goal</h2>
        <form className="goals-form" onSubmit={handleFormSubmit}>
          <label htmlFor="measure">Enter a Total Energy Limit Goal (Wh)</label>
          <input
            id="measure"
            type="number"
            step="any"
            placeholder="e.g., 50"
            value={measure}
            onChange={(e) => setMeasure(e.target.value)}
            required
          />

          <label htmlFor="duration">Goal Deadline</label>
          <input
            id="duration"
            type="date"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />

          <button type="submit" className="goals-submit">Submit</button>
        </form>
      </div>

      <div className="goals-right">
        <h2>All Goals</h2>
        <div className="currentGoals">
          {goals.length === 0 ? (
            <p>No current goals.</p>
          ) : (
            goals.map((goal) => {
              const goalDate = new Date(goal.duration);
              const now = new Date();
              const isExpired = goalDate < now;
              const isAchieved = !isExpired && energyUsed <= goal.measure;

              return (
                <div key={goal.id} className={`goalItem ${isExpired ? 'expired' : isAchieved ? 'completed' : 'inProgress'}`}>
                  <div className={`goalMarker ${isAchieved ? 'checked' : ''}`}></div>
                  <div className="goalDetails">
                    <div><strong>Energy Limit:</strong> {goal.measure} Wh</div>
                    <div><strong>Deadline:</strong> {new Date(goal.duration).toLocaleDateString()}</div>
                    <div><strong>Status:</strong> 
                      {isExpired 
                        ? ' Expired' 
                        : isAchieved 
                          ? ' Goal Met' 
                          : ' Over Limit'}
                    </div>
                  </div>
                  <button className="delete-button" onClick={() => deleteGoal(goal.id)}>
                    🗑
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="energyGraph">
          <h2>Total Energy Used: {energyUsed} Wh</h2>
        </div>
      </div>
    </div>
  );
};

export default Goals;
