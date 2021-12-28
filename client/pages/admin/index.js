import AdminRoute from "../../components/routes/AdminRoute";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import ChartCard from "../../components/cards/ChartCard";

const data = [
  {
    name: "20/12",
    number_of_user: 2400,
  },
  {
    name: "21/12",
    number_of_user: 1398,
  },
  {
    name: "22/12",
    number_of_user: 800,
  },
  {
    name: "23/12",
    number_of_user: 3908,
  },
  {
    name: "24/12",
    number_of_user: 4800,
  },
  {
    name: "25/12",
    number_of_user: 3800,
  },
  {
    name: "26/12",
    number_of_user: 4300,
  },
];

const AdminIndex = () => {
  const [dailyUsers, setDailyUsers] = useState([]);
  const [dailyCourses, setDailyCourses] = useState([]);
  const [dailyProfit, setDailyProfit] = useState([]);
  const [dailyEnrollments, setDailyEnrollments] = useState([]);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    const { data } = await axios.get(
      "/api/daily-report?fromDate=2021-12-21&toDate=2021-12-28"
    );
    const formattedData = dataFormatter(data);
    setDailyUsers(formattedData);
    setDailyCourses(formattedData);
    setDailyProfit(formattedData);
    setDailyEnrollments(formattedData);
  };

  const dataFormatter = (data) =>
    data.map((e) => ({ ...e, date: moment(e.date).format("DD/MM") }));

  return (
    <AdminRoute>
      <h1 className="jumbotron text-center square">Admin Dashboard</h1>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6">
            <ChartCard
              title="Daily new users"
              data={dailyUsers}
              xDataKey="date"
              yDataKey="users"
              color="#8884d8"
              toolTipFormat="New users"
              legendFormat="Daily new users"
              chart="bar"
            />
          </div>
          <div className="col-md-6">
            <ChartCard
              title="Daily new courses"
              data={dailyCourses}
              xDataKey="date"
              yDataKey="courses"
              color="#fcba03"
              toolTipFormat="New courses"
              legendFormat="Daily new courses"
              chart="bar"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <ChartCard
              title="Daily new enrollment"
              data={dailyEnrollments}
              xDataKey="date"
              yDataKey="enrollments"
              color="#03fcf4"
              toolTipFormat="New enrollment"
              legendFormat="Daily new enrollment"
              chart="bar"
            />
          </div>
          <div className="col-md-6">
            <ChartCard
              title="Daily profit"
              data={dailyProfit}
              xDataKey="date"
              yDataKey="profit"
              color="#0e9c4e"
              toolTipFormat="Profit"
              legendFormat="Daily profit"
              chart="line"
            />
          </div>
        </div>
      </div>
    </AdminRoute>
  );
};

export default AdminIndex;
