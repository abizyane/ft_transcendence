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
  data: number[];
}

const LineChart: React.FC<LineChartProps> = ({data}) => {
  const ChartData: ChartData<"line", number[]> = {
    labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    datasets: [
      {
        label: "Days Experience",
        data: data, // Example data
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
            return `Sales: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  return (
    <div className=" w-full p-1 h-72  lg:h-[18vh] xl:h-[22vh] 2xl:h-[24vh]">
      <Line data={ChartData} options={options} style={{width:"99%",height:"99%"}} />
      &nbsp;
    </div>
  );
};

export default LineChart;
