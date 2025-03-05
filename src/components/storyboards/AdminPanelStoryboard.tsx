import React from "react";
import AdminDashboard from "../admin/AdminDashboard";
import ProtectedRoute from "../ProtectedRoute"; // Импортируем новый компонент

const AdminPanelStoryboard = () => {
  return (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  );
};

export default AdminPanelStoryboard;