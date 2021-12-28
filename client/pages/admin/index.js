import { useEffect, useState } from "react";
import AdminRoute from "../../components/routes/AdminRoute";
import axios from "axios";
import moment from "moment";
import ChartCard from "../../components/cards/ChartCard";
import { toast } from "react-toastify";

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

  const dataFormatter = (data) => {
    return data.map((e) => ({ ...e, date: moment(e.date).format("DD/MM") }));
  };

  const handleRefreshData = async (dates, setData, setLoading) => {
    try {
      setLoading(true);
      const formattedDates = dates.map((date) =>
        moment.utc(date).startOf("day").format("YYYY-MM-DD")
      );

      const { data } = await axios.get(
        `/api/daily-report?fromDate=${formattedDates[0]}&toDate=${formattedDates[1]}`
      );
      const formattedData = dataFormatter(data);
      setData(formattedData);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      if (err.response) toast.error(err.response.data);
    }
  };

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
              setData={setDailyUsers}
              handleRefreshData={handleRefreshData}
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
              setData={setDailyCourses}
              handleRefreshData={handleRefreshData}
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
              setData={setDailyEnrollments}
              handleRefreshData={handleRefreshData}
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
              setData={setDailyProfit}
              handleRefreshData={handleRefreshData}
            />
          </div>
        </div>
      </div>
    </AdminRoute>
  );
};

export default AdminIndex;
