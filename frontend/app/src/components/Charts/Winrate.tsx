import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import dataFromJson from '../../app/data/Dashboarddata.json';
import { useEffect, useState } from 'react';
import Loader from '../loader/loader';
import toast from 'react-hot-toast';
import { customFetch } from '@/utils/customFetch';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  idUser: number;
}
interface DataWinRate {
  totalGames: number;
  wins: number;
  winRate: number;
}

const DoughnutChart: React.FC<DoughnutChartProps>  = ({idUser}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DataWinRate | null>(null);
  const fetchWinrate = async () => {
    setLoading(true);
    try {
      const response = await customFetch(process.env.NEXT_PUBLIC_API_URL+'/api/win_rate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: idUser,
        }),
      });

      if (response && response.ok) {
        const data = await response.json() as DataWinRate;
        setData(data);
      } else if (response) {
        const errorData = await response.json();
        toast.error('Failed to fetch win rate');
      }
    } catch (error) {
      toast.error('Error during the request');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWinrate();
  }, []);
  
  const chartdata = {
    datasets: [
      {
        data: [data?.winRate,100-data?.winRate], 
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
    (loading) ? <Loader/> :(

      <div className="w-[99%] h-[90%]">
        <div className="absolute z-50 w-full h-full flex justify-center items-center">
          <p className="text-white font-mont sm:font-bold text-xs pt-2">
          {data?.winRate}%
          </p>
        </div>
        <Doughnut data={chartdata} options={options} />
      </div>
    )
  );
};

export default DoughnutChart;
