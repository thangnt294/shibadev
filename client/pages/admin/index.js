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
  return (
    <AdminRoute>
      <h1 className="jumbotron text-center square">Admin Dashboard</h1>
      <BarChart width={730} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis dataKey="number_of_user" />
        <Tooltip formatter={(value, name, props) => [value, "New users"]} />
        <Legend
          formatter={(value, name, props) => "Number of new users daily"}
        />
        <Bar
          dataKey="number_of_user"
          fill="#8884d8"
          label={{ position: "top" }}
        />
      </BarChart>
    </AdminRoute>
  );
};

export default AdminIndex;
