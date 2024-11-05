import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import dataFromJson from '../../app/data/Dashboarddata.json';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  winpercentage: number; // Define the type of winPercentage
}

const DoughnutChart: React.FC<DoughnutChartProps>  = ({winpercentage}) => {

  const chartdata = {
    datasets: [
      {
        data: [winpercentage,100-winpercentage], 
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
    <div className="w-[99%] h-[90%]">
      <div className="absolute z-50 w-full h-full flex justify-center items-center">
        <p className="text-white font-mont sm:font-bold text-xs pt-2">
        {winpercentage}%
        </p>
      </div>
      <Doughnut data={chartdata} options={options} />
    </div>
  );
};

export default DoughnutChart;
