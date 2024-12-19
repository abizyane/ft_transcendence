// components/LineChart.tsx
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartData,
  Filler,
  ChartOptions,
} from "chart.js";
import { useEffect, useState } from "react";
import Loader from "../loader/loader";
import toast from 'react-hot-toast';


ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Filler,
  Legend
);
interface LineChartProps {
  userid: number;
}

const LineChart: React.FC<LineChartProps> = ({userid}) => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  const fetchExperience = async () => {
    try {
      setLoading(true);
      const response = await fetch(process.env.NEXT_PUBLIC_HOST_URL+':8000/api/weekly_experience', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userid,
        }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        let newStats = {
          labels: [],
          xp_gained: [],
        };
        
        Object.keys(data.dailyXP).reverse().forEach(key => {
          const dayStats = data.dailyXP[key];
          newStats.labels.push(key);
          newStats.xp_gained.push(dayStats.xp_gained);
        });
        
        setStats(newStats);
      } else {
        toast.error('Failed to fetch stats:', await response.json());
      }
    } catch (error) {
      toast.err('Error during the request:');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperience();
  }, []);
  const ChartData: ChartData<"line", number[]> = {
    labels: stats?.labels || ['D-6', 'D-5', 'D-4', 'D-3', 'D-2', 'D-1', 'D'],
    datasets: [
      {
        label: "Days Experience",
        data: stats?.xp_gained || [0, 0, 0, 0, 0, 0, 0],
        borderColor: "#8A2BE2",
        backgroundColor: "rgba(138, 43, 226, 0.2)",
        fill: true,
        pointRadius: 5,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: "#333",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `Xp gained: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  return (
    <div className=" w-full p-1 h-72  lg:h-[18vh] xl:h-[22vh] 2xl:h-[24vh]">
      {loading ? <div className="w-full h-full flex justify-center items-center"><Loader/></div> : <Line data={ChartData} options={options} style={{width:"99%",height:"99%"}} />}
    </div>
  );
};

export default LineChart;
