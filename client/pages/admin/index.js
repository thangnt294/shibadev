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
      "/api/daily-report?fromDate=2021-12-27&toDate=2021-12-27"
    );
    setDailyUsers(data);
    setDailyCourses(data);
    setDailyProfit(data);
    setDailyEnrollments(data);
  };
  return (
    <AdminRoute>
      <h1 className="jumbotron text-center square">Admin Dashboard</h1>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <h5 className="card-title text-center mb-4">Daily new users</h5>
              <BarChart width={730} height={300} data={dailyUsers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis dataKey="users" />
                <Tooltip
                  formatter={(value, name, props) => [value, "New users"]}
                />
                <Legend formatter={(value, name, props) => "Daily new users"} />
                <Bar
                  dataKey="users"
                  fill="#8884d8"
                  label={{ position: "top" }}
                />
              </BarChart>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card">
              <h5 className="card-title text-center mb-4">Daily new courses</h5>
              <BarChart width={730} height={300} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis dataKey="number_of_user" />
                <Tooltip
                  formatter={(value, name, props) => [value, "New users"]}
                />
                <Legend
                  formatter={(value, name, props) => "Daily new courses"}
                />
                <Bar
                  dataKey="number_of_user"
                  fill="#8884d8"
                  label={{ position: "top" }}
                />
              </BarChart>
            </div>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
};

export default AdminIndex;
