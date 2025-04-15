// Install chart libraries (npm install chart.js react-chartjs-2)
import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import "./Data.css"
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
    // Sample Data for graphs
    const currentWeekData = [22, 19, 24, 21, 20, 18, 23];
    const lastWeekTotal = 145;
    const currentWeekTotal = currentWeekData.reduce((acc, val) => acc + val, 0);

    const barData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'Current Week Consumption (kWh)',
            data: currentWeekData,
            backgroundColor: '#4caf50',
          },
        ],
      };

      const pieData = {
        labels: ['Last Week', 'This week'],
        datasets: [
            {
                label: 'Total kWh',
                data: [lastWeekTotal, currentWeekTotal],
                backgroundColor: ['#81c784', '#388e3c'],
            },
        ],
      };

  return (
    <div className="data-page">
        <h1>View Data</h1>
        <div className="charts">
            <div className="bar-graph">
                <h2>Daily Energy Use</h2>
                <Bar data={barData} options={{ responsive: true }} />
            </div>
            <div className="pie-chart">
                <h2>Comparison</h2>
                <Pie data={pieData} options={{responsive: true}} />
            </div>
        </div>
    </div>
  );
};

export default Data;
