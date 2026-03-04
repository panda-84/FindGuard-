

import { Navigate, Outlet } from "react-router-dom";

export const PublicRoute = () => {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");

  if (token) {
    if (role === "admin") return <Navigate to="/superadmin" replace />;
    if (role === "company") return <Navigate to="/admin" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
