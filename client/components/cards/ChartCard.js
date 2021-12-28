import {
  LineChart,
  Line,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";
import moment from "moment";

const ChartCard = ({
  title,
  data,
  xDataKey,
  yDataKey,
  color,
  toolTipFormat,
  legendFormat,
  chart,
}) => {
  return (
    <div className="card mb-4">
      <h5 className="card-title text-center mb-4 mt-2">{title}</h5>
      {chart === "bar" ? (
        <BarChart width={730} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xDataKey} />
          <YAxis dataKey={yDataKey} allowDecimals={yDataKey === "profit"} />
          <Tooltip formatter={(value, name, props) => [value, toolTipFormat]} />
          <Legend formatter={(value, name, props) => legendFormat} />
          <Bar dataKey={yDataKey} fill={color} label={{ position: "top" }} />
        </BarChart>
      ) : (
        <LineChart width={730} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xDataKey} />
          <YAxis dataKey={yDataKey} allowDecimals={yDataKey === "profit"} />
          <Tooltip formatter={(value, name, props) => [value, toolTipFormat]} />
          <Legend formatter={(value, name, props) => legendFormat} />
          <Line dataKey={yDataKey} stroke={color} label={{ position: "top" }} />
        </LineChart>
      )}
    </div>
  );
};

export default ChartCard;
