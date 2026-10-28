import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data }) => {
  const labels = data.map(item => item.label);
  const values = data.map(item => item.value);

  // Palet warna enterprise bersih
  const backgroundColors = ['#2563eb', '#0ea5e9', '#f59e0b', '#10b981', '#64748b'];

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: backgroundColors.slice(0, values.length),
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 12,
          color: '#475569',
          font: {
            size: 11,
            family: 'Inter, sans-serif',
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default PieChart;
