import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { PublicRoute }  from "./routes/PublicRoute";
import { PrivateRoute } from "./routes/PrivateRoute";
import LoginPage      from "./pages/public/log";
import SignupPage     from "./pages/public/reg";
import ForgetPassword from "./pages/public/fog";
import ResetPassword  from "./pages/public/ResetPassword";
import CustomerDashboard from "./pages/private/user/CustomerDashboard";
import ComDash from "./pages/private/company/ComDash";
import SuperAdminDash from "./pages/private/admin/SuperAdminDash";

export const AppRoutes = () => (
  <Suspense fallback={
    <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-white text-xl">Loading...</p>
    </div>
  }>
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      {/* PUBLIC */}
      <Route element={<PublicRoute />}>
        <Route path="/login"           element={<LoginPage />} />
        <Route path="/register"        element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/reset-password"  element={<ResetPassword />} />
      </Route>

      {/* CUSTOMER */}
      <Route element={<PrivateRoute allowedRole="customer" />}>
        <Route path="/dashboard" element={<CustomerDashboard />} />
      </Route>

      {/* COMPANY */}
      <Route element={<PrivateRoute allowedRole="company" />}>
        <Route path="/admin" element={<ComDash />} />
      </Route>

      {/* SUPER ADMIN */}
      <Route element={<PrivateRoute allowedRole="admin" />}>
        <Route path="/superadmin" element={<SuperAdminDash />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  </Suspense>
);