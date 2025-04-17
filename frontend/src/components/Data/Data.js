import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import './Data.css';
import useAuthRedirect from '../../hooks/useAuthRedirect';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

const Data = () => {
  useAuthRedirect();
  const [monthlyData, setMonthlyData] = useState([]);
  const [energyLabels, setEnergyLabels] = useState([]);
  const [energyValues, setEnergyValues] = useState([]);

  useEffect(() => {
    const fetchMonthlyEnergy = async () => {
      try {
        const res = await fetch('https://greengpt.onrender.com/api/energy-monthly', {
          credentials: 'include',
        });
        const data = await res.json();

        if (Array.isArray(data)) {
          const labels = data.map(entry =>
            new Date(2024, entry.month - 1).toLocaleString('default', { month: 'short' })
          );
          const values = data.map(entry => parseFloat(entry.total));

          setMonthlyData(data);
          setEnergyLabels(labels);
          setEnergyValues(values);
        } else {
          console.error('Unexpected energy data:', data);
        }
      } catch (err) {
        console.error('Error fetching monthly energy:', err);
      }
    };

    fetchMonthlyEnergy();
  }, []);

  const monthlyBarData = {
    labels: energyLabels,
    datasets: [
      {
        label: 'Monthly Energy Use (Wh)',
        data: energyValues,
        backgroundColor: '#4caf50',
      },
    ],
  };

  const lastTwoMonths = monthlyData.slice(-2);
  const pieLabels = lastTwoMonths.map(entry =>
    new Date(2024, entry.month - 1).toLocaleString('default', { month: 'short' })
  );
  const pieValues = lastTwoMonths.map(entry => parseFloat(entry.total || 0));

  const pieData = {
    labels: pieLabels.length === 2 ? pieLabels : ['Previous', 'Current'],
    datasets: [
      {
        label: 'Monthly Energy Comparison (Wh)',
        data: pieValues.length === 2 ? pieValues : [0, 0],
        backgroundColor: ['#81c784', '#388e3c'],
      },
    ],
  };

  return (
    <div className="data-page">
      <h1>View Data</h1>

      <div className="charts">
        <div className="bar-graph">
          <h2>Monthly Energy Use</h2>
          <div className="bar-container">
            <Bar data={monthlyBarData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="pie-chart">
          <h2>Comparison</h2>
          {pieLabels.length < 2 && (
            <p style={{ color: '#888', marginBottom: '1rem' }}>
              Not enough data yet to compare this month and last month.
            </p>
          )}
          <Pie data={pieData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default Data;
