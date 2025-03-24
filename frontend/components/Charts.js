'use client';
import React from 'react';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Default data for inventory chart
const defaultInventoryData = {
  labels: ['Pipes', 'Fittings', 'Valves', 'Tools', 'Fixtures', 'Sealants'],
  datasets: [
    {
      label: 'Current Stock',
      data: [120, 80, 50, 200, 30, 60],
      backgroundColor: '#fdc501',
    },
    {
      label: 'Minimum Stock',
      data: [50, 30, 20, 80, 15, 25],
      backgroundColor: '#e0e0e0',
    }
  ]
};

// Default data for sales chart
const defaultSalesData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Sales 2024',
      data: [30, 45, 60, 70, 65, 80],
      borderColor: '#fdc501',
      backgroundColor: 'rgba(253, 197, 1, 0.1)',
      tension: 0.4,
      fill: true,
    }
  ]
};

// Default options
const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
  },
};

export const InventoryChart = ({ data = defaultInventoryData, options = defaultOptions, type = 'bar' }) => {
  const ChartComponent = type === 'bar' ? Bar : 
                         type === 'line' ? Line : 
                         type === 'pie' ? Pie : Doughnut;
  
  return (
    <div className="w-full h-64">
      <ChartComponent data={data} options={options} />
    </div>
  );
};

export const SalesChart = ({ data = defaultSalesData, options = defaultOptions, type = 'line' }) => {
  const ChartComponent = type === 'bar' ? Bar : 
                         type === 'line' ? Line : 
                         type === 'pie' ? Pie : Doughnut;
  
  return (
    <div className="w-full h-64">
      <ChartComponent data={data} options={options} />
    </div>
  );
};

// Default export with both components
export default {
  InventoryChart,
  SalesChart
};
