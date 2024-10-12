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

const LineChart: React.FC = () => {
  const data: ChartData<"line", number[]> = {
    labels: ["January", "February", "March", "April", "May", "June", "July"], // Example labels
    datasets: [
      {
        label: "Monthly Sales",
        data: [10, 20, 15, 25, 30, 20, 35], // Example data
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
      <Line data={data} options={options} style={{width:"100%",height:"100%"}} />
      &nbsp;
    </div>
  );
};

export default LineChart;
