import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { PublicRoute } from "../src/routes/PublicRoute";
import { PrivateRoute } from "../src/routes/PrivateRoute";
import LoginPage from "../src/pages/public/log";
import SignupPage from "../src/pages/public/reg";
import DashboardPage from "../src/pages/private/dashboard";
import ForgetPassword  from "../src/pages/public/fog";


export const AppRoutes = () => (
  <>
    <Suspense fallback={<div>...Loading </div>}>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgetPassword/>} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  </>
);
