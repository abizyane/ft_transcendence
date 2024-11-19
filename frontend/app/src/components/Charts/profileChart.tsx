
import React from 'react';
import { Bar } from 'react-chartjs-2'; 
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Link from 'next/link';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ProfileChart = ({ user }) => {
  const DATA_COUNT = 7;
  const labels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];

  const winData = [5, 3, 4, 6, 5, 7, 3]; 
  const lossData = [2, 4, 3, 1, 4, 3, 5]; 


  const violetColor = 'rgba(148, 0, 211, 1)'; 
  const transparentViolet = 'rgba(148, 0, 211, 0.5)'; 

  const greyColor = 'rgba(169, 169, 169, 1)'; 
  const transparentGrey = 'rgba(169, 169, 169, 0.5)'; 

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Wins',
        data: winData,
        borderColor: violetColor,
        backgroundColor: transparentViolet,
        barThickness: '12',
      },
      {
        label: 'Losses',
        data: lossData, 
        borderColor: greyColor,
        backgroundColor: transparentGrey,
        barThickness: '12',
      }
    ]
  };

  const options = {
    responsive: true,
  };

  return (
    <div className="flex-1  mt-8 w-full lg:mt-0 py-4 lg:w-1/3  overflow-hidden">
        <div className="bg-gray-800/60 rounded-xl border border-violet-primary">
          <p className="m-4 text-white text-2xl font-extrabold">STATS</p>
          <div className='h-[300px]  w-full'>
            <Bar data={data} options={options} />
          </div>
         </div>
    </div>
  );
};

export default ProfileChart;
