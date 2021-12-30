import { useState, useEffect } from "react";
import axios from "axios";
import AdminRoute from "../../components/routes/AdminRoute";

const ManageCourses = () => {
  return (
    <AdminRoute>
      <h1 className="jumbotron text-center square">Manage Courses</h1>
    </AdminRoute>
  );
};

export default ManageCourses;
