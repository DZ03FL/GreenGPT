import React, { useState, useEffect } from 'react';
import './Goals.css';

const Goals = () => {
  const [goalName, setGoalName] = useState('');
  const [measure, setMeasure] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [goals, setGoals] = useState([]);

  // On mount, load stored goals from localStorage using a fixed key.
  useEffect(() => {
    const storedGoals = localStorage.getItem("goals");
    if (storedGoals) {
      setGoals(JSON.parse(storedGoals));
    }
  }, []);

  // Save goals to localStorage whenever they change.
  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const newGoal = {
      id: Date.now(),
      goalName,
      measure,
      category,
      message,
      completed: false,
    };

    setGoals([...goals, newGoal]);
    setGoalName('');
    setMeasure('');
    setCategory('');
    setMessage('');
  };

  const toggleCompleted = (id) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    );
    setGoals(updatedGoals);
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter((goal) => goal.id !== id));
  };

  return (
    <div className="goals-container">
      {/* Left Column: Carousel Placeholder and Set Goal Form */}
      <div className="goals-left">
        <div className="carousel">Carousel Placeholder</div>
        <h2>Set New Energy Goal</h2>
        <form className="goals-form" onSubmit={handleFormSubmit}>
          <label htmlFor="goalName">Enter Goal</label>
          <input
            id="goalName"
            type="text"
            placeholder="e.g., Save 50 kWh"
            value={goalName}
            onChange={(e) => setGoalName(e.target.value)}
            required
          />

          <label htmlFor="measure">Measure</label>
          <input
            id="measure"
            type="text"
            placeholder="e.g., kWh, Water, Prompt Count"
            value={measure}
            onChange={(e) => setMeasure(e.target.value)}
            required
          />

          <label htmlFor="category">Set Category</label>
          <input
            id="category"
            type="text"
            placeholder="e.g., Energy Usage"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />

          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            placeholder="Share a note for your goal..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button type="submit" className="goals-submit">Submit</button>
        </form>
      </div>

      {/* Right Column: Current Goals and Energy Graph */}
      <div className="goals-right">
        <h2>Current Goals</h2>
        <div className="currentGoals">
          {goals.length === 0 ? (
            <p>No current goals.</p>
          ) : (
            goals.map((goal) => (
              <div key={goal.id} className={`goalItem ${goal.completed ? 'completed' : 'inProgress'}`}>
                {/* Clickable checkmark marker */}
                <div
                  className={`goalMarker ${goal.completed ? 'checked' : ''}`}
                  onClick={(e) => {
                    toggleCompleted(goal.id);
                    e.currentTarget.blur();
                  }}
                ></div>
                <div className="goalDetails">
                  <div className="goalTitle">{goal.goalName}</div>
                  <div className="goalCategory">
                    <strong>Category:</strong> {goal.category}
                  </div>
                  <div className="goalMessage">
                    <strong>Message:</strong> {goal.message}
                  </div>
                </div>
                <button className="delete-button" onClick={() => deleteGoal(goal.id)}>
                  Delete
                </button>
              </div>
            ))
          )}
        </div>

        <div className="energyGraph">
          <h3>Current Energy Graph</h3>
          <p>kW/H Used: 1200</p>
          <div className="graph-placeholder">Graph Placeholder</div>
        </div>
      </div>
    </div>
  );
};

export default Goals;