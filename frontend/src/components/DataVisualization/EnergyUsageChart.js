import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';

const EnergyUsageChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('/api/energy-usage') // adjust if route is different
      .then(res => {
        // Assuming backend sends: [{ month: 1, energy_used_wh: 14.2 }, ...]
        const transformed = res.data.map(entry => ({
          name: `Month ${entry.month}`,
          energy: entry.energy_used_wh,
          co2: (entry.energy_used_wh * 0.4).toFixed(2),  // in grams
          cost: (entry.energy_used_wh * 0.10).toFixed(3) // in USD
        }));
        setData(transformed);
      })
      .catch(err => {
        console.error("Error loading energy usage data:", err);
      });
  }, []);

  return (
    <div style={{ width: '100%', height: 400 }}>
      <h3>Monthly Energy Usage</h3>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis label={{ value: 'Wh', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Line type="monotone" dataKey="energy" stroke="#82ca9d" name="Energy Used (Wh)" />
          <Line type="monotone" dataKey="co2" stroke="#8884d8" name="CO₂ Emissions (g)" />
          <Line type="monotone" dataKey="cost" stroke="#ff7300" name="Cost ($)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EnergyUsageChart;
