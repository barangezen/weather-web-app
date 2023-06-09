import type { ChartData, ChartOptions, Point } from "chart.js";
import {
  Chart as ChartJS,
  CategoryScale,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ILineChart {
  title?: string;
  data: ChartData<"line", (number | Point | null)[], unknown>;
  options: ChartOptions;
}

export const LineChart: React.FC<ILineChart> = ({ title, data, options }) => {
  return (
    <div>
      <span className="text-lg font-bold">{title}</span>
      <Line data={data} options={options} />
    </div>
  );
};
