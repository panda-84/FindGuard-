// PrivateRoute.jsx
// This protects private pages from unauthorized access
// If no token → go to login
// If wrong role → go to correct page

import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoute = ({ allowedRole }) => {
  // Get token and role from localStorage
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");

  // If no token, user is not logged in → go to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If role doesn't match what this route allows
  // Redirect them to their correct page
  if (allowedRole && role !== allowedRole) {
    if (role === "admin") return <Navigate to="/superadmin" replace />;
    if (role === "company") return <Navigate to="/admin" replace />;
    if (role === "customer") return <Navigate to="/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  // If token exists and role matches → show the page
  return <Outlet />;
};

export default PrivateRoute;
