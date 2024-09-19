// components/DoughnutChart.js
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = () => {
  const data = {
    datasets: [
      {
        data: [20, 80],
        backgroundColor: ['#8A2BE2', '#E0E0E0'],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      tooltip: {
        enabled: false,
      },
    },
  };

  return (
    <div className=" w-[99%] h-[99%] ">
      <div className=" absolute z-50  w-full h-full flex justify-center items-center">
        <p className="text-white font-mont sm:font-bold text-xs pt-2">20%</p>
      </div>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default DoughnutChart;
