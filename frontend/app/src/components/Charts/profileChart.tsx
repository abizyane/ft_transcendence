
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2'; 
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Link from 'next/link';
import Loader from '../loader/loader';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ProfileChart = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(process.env.NEXT_PUBLIC_HOST_URL+':8000/api/weekly_stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: user.id,
        }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        let newStats = {
          labels: [],
          winData: [],
          lossData: [],
          dates: []
        };
        
        Object.keys(data.dailyStats).reverse().forEach(key => {
          const dayStats = data.dailyStats[key];
          newStats.labels.push(key);
          newStats.winData.push(dayStats.wins);
          newStats.lossData.push(dayStats.losses);
          newStats.dates.push(dayStats.date);
        });
        
        setStats(newStats);
      } else {
        console.log('Failed to fetch stats:', await response.json());
      }
    } catch (error) {
      console.log('Error during the request:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);


  const violetColor = 'rgba(148, 0, 211, 1)'; 
  const transparentViolet = 'rgba(148, 0, 211, 0.5)'; 

  const greyColor = 'rgba(169, 169, 169, 1)'; 
  const transparentGrey = 'rgba(169, 169, 169, 0.5)'; 

  const data = {
    labels: stats?.labels || ['D-6', 'D-5', 'D-4', 'D-3', 'D-2', 'D-1', 'D'],
    datasets: [
      {
        label: 'Wins',
        data: stats?.winData || [0, 0, 0, 0, 0, 0, 0],
        borderColor: violetColor,
        backgroundColor: transparentViolet,
        barThickness: '12',
      },
      {
        label: 'Losses',
        data: stats?.lossData || [0, 0, 0, 0, 0, 0, 0],
        borderColor: greyColor,
        backgroundColor: transparentGrey,
        barThickness: '12',
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="flex-1 h-full mt-8 w-full lg:mt-0 py-4 lg:w-1/3 ">
        <div className="bg-gray-800/60 rounded-xl border border-violet-primary h-fit ">
          <p className="m-4 text-white text-2xl font-extrabold">STATS</p>
          <div className='h-fit lg:h-[300px]  w-full  flex justify-center items-center'>
            {loading ? <Loader /> : <Bar data={data} options={options} className='h-full w-full p-2' />}
          </div>
         </div>
    </div>
  );
};

export default ProfileChart;
