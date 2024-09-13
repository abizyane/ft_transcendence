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
  ChartOptions,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
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
        pointRadius: 5, // Ensures points are visible
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
    <div className="relative w-full h-[200px] p-1">
      {" "}
      {/* Adjust the height as needed */}
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
