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


  return (
    <div className="data-page">
        <h1>Data Page</h1>
    </div>
  );
};

export default Data;
