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
  ResponsiveContainer,
} from "recharts";
import { DatePicker, Button, Space } from "antd";
import { useState } from "react";
import SmallLoading from "../others/SmallLoading";

const { RangePicker } = DatePicker;

const ChartCard = ({
  title,
  data,
  xDataKey,
  yDataKey,
  color,
  toolTipFormat,
  legendFormat,
  chart,
  setData,
  handleRefreshData,
}) => {
  const [dates, setDates] = useState([]);
  const [hackValue, setHackValue] = useState();
  const [value, setValue] = useState();
  const [loading, setLoading] = useState(false);

  const disabledDate = (current) => {
    if (!dates || dates.length === 0) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], "days") > 7;
    const tooEarly = dates[1] && dates[1].diff(current, "days") > 7;
    return tooEarly || tooLate;
  };

  const onOpenChange = (open) => {
    if (open) {
      setHackValue([]);
      setDates([]);
    } else {
      setHackValue(undefined);
    }
  };

  const onRefresh = async () => {
    await handleRefreshData(dates, setData, setLoading);
  };

  return (
    <div className="card mb-4">
      <h5 className="card-title text-center mb-4 mt-2">{title}</h5>
      <Space className="d-flex justify-content-center mb-3" size="middle">
        <RangePicker
          value={hackValue || value}
          disabledDate={disabledDate}
          onCalendarChange={(val) => setDates(val)}
          onChange={(val) => setValue(val)}
          onOpenChange={onOpenChange}
        />
        <Button onClick={onRefresh}>Refresh</Button>
      </Space>
      {loading ? (
        <div style={{ height: "300px" }}>
          <SmallLoading />
        </div>
      ) : chart === "bar" ? (
        <ResponsiveContainer width="90%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xDataKey} />
            <YAxis dataKey={yDataKey} allowDecimals={yDataKey === "profit"} />
            <Tooltip
              formatter={(value, name, props) => [value, toolTipFormat]}
            />
            <Legend formatter={(value, name, props) => legendFormat} />
            <Bar dataKey={yDataKey} fill={color} label={{ position: "top" }} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="90%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xDataKey} />
            <YAxis dataKey={yDataKey} allowDecimals={yDataKey === "profit"} />
            <Tooltip
              formatter={(value, name, props) => [value, toolTipFormat]}
            />
            <Legend formatter={(value, name, props) => legendFormat} />
            <Line
              dataKey={yDataKey}
              stroke={color}
              label={{ position: "top" }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ChartCard;
