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
    <div className=" w-full p-1 h-60  lg:h-[20vh] xl:h-[30vh]">
      <Line data={ChartData} options={options} style={{width:"100%",height:"100%"}} />
      &nbsp;
    </div>
  );
};

export default LineChart;
