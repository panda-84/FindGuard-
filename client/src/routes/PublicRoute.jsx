// PublicRoute.jsx
// This is for pages that only non-logged-in users should see
// Like login and register pages
// If already logged in → redirect to correct dashboard

import { Navigate, Outlet } from "react-router-dom";

export const PublicRoute = () => {
  // Get token and role from localStorage
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");

  // If already logged in, redirect to correct page
  if (token) {
    if (role === "admin") return <Navigate to="/superadmin" replace />;
    if (role === "company") return <Navigate to="/admin" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  // If not logged in, show the public page (login/register)
  return <Outlet />;
};

export default PublicRoute;
