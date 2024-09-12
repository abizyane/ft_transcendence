import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = () => {
  const data = {
    datasets: [
      {
        data: [20, 80], // 20% win rate, 80% empty space
        backgroundColor: ['#8A2BE2', '#E0E0E0'], // Violet for the win rate, light grey for the rest
        borderWidth: 0, // Removes the border
      },
    ],
  };

  const options = {
    cutout: '70%', // Makes space in the center for text
    plugins: {
      tooltip: {
        enabled: false, // Disables the tooltip
      },
    },
  };

  return (
    <div className="relative">
      <Doughnut data={data} options={options} />
      {/* Centered Text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-white font-bold text-xl">Win Rate 20%</p>
      </div>
    </div>
  );
};

export default DoughnutChart;
