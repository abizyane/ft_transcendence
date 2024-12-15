import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import dataFromJson from '../../app/data/Dashboarddata.json';
import { useEffect, useState } from 'react';
import Loader from '../loader/loader';

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
      const response = await fetch(process.env.NEXT_PUBLIC_HOST_URL+':8000/api/win_rate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: idUser,
        }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json() as DataWinRate;
        console.log('Friend request accepted:', data);
        // Update the relationship after success
        // onRelationshipChange("Friend");
        setData(data);
      } else {
        const errorData = await response.json();
        console.log('Failed to accept friend request:', errorData);
      }
    } catch (error) {
      console.log('Error during the request:', error);
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
