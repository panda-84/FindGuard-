// AppRoutes.jsx
// Only has the pages that exist right now
// We will add more pages later step by step

import React, { Suspense, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { PublicRoute } from "./routes/PublicRoute";
import { PrivateRoute } from "./routes/PrivateRoute";

// ── PUBLIC PAGES (already exist) ──────────────
import LoginPage from "./pages/public/log";
import SignupPage from "./pages/public/reg";
import ForgetPassword from "./pages/public/fog";

// ── SIMPLE PLACEHOLDER for pages not built yet ──
// This shows a simple page so app doesnt crash
const ComingSoon = ({ title }) => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-white mb-3">{title}</h1>
      <p className="text-slate-400">This page is coming soon...</p>
    </div>
  </div>
);

// ── CUSTOMER DASHBOARD (simple for now) ──────────
const CustomerDashboard = () => {
  const [currentPage, setCurrentPage] = useState("home");

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-slate-950">

      {/* Simple Nav */}
      <header className="bg-black px-6 py-4 flex items-center justify-between">
        <h1 className="text-white font-bold text-xl">🛡 FindGuard</h1>
        <div className="flex gap-3 flex-wrap">
          {["home", "companies", "securities", "profile"].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-lg font-medium text-sm capitalize transition-colors ${
                currentPage === page
                  ? "bg-white text-gray-800"
                  : "bg-blue-600 text-white hover:bg-blue-500"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg font-medium text-sm bg-red-600 text-white hover:bg-red-500"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Page Content */}
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-2 capitalize">
          {currentPage} Page
        </h2>
        <p className="text-slate-400">
          You are logged in as a <strong className="text-blue-400">Customer</strong>
        </p>
        <p className="text-slate-500 text-sm mt-2">
          Full pages coming in next steps...
        </p>
      </div>

    </div>
  );
};

// ── COMPANY ADMIN (simple for now) ───────────────
const CompanyAdmin = () => {
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-3">🛡 Company Admin</h1>
        <p className="text-slate-400 mb-6">
          You are logged in as a <strong className="text-amber-400">Company</strong>
        </p>
        <p className="text-slate-500 text-sm mb-6">
          Full admin dashboard coming in next steps...
        </p>
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

// ── SUPER ADMIN (simple for now) ─────────────────
const SuperAdmin = () => {
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-3">👑 Super Admin</h1>
        <p className="text-gray-400 mb-6">
          You are logged in as <strong className="text-purple-400">Admin</strong>
        </p>
        <p className="text-gray-500 text-sm mb-6">
          Full admin panel coming in next steps...
        </p>
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

// ── ALL ROUTES ────────────────────────────────────
export const AppRoutes = () => (
  <Suspense fallback={
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <p className="text-white">Loading...</p>
    </div>
  }>
    <Routes>

      {/* ROOT → login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* PUBLIC ROUTES */}
      <Route element={<PublicRoute />}>
        <Route path="/login"          element={<LoginPage />} />
        <Route path="/register"       element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
      </Route>

      {/* CUSTOMER ROUTES */}
      <Route element={<PrivateRoute allowedRole="customer" />}>
        <Route path="/dashboard" element={<CustomerDashboard />} />
      </Route>

      {/* COMPANY ROUTES */}
      <Route element={<PrivateRoute allowedRole="company" />}>
        <Route path="/admin" element={<CompanyAdmin />} />
      </Route>

      {/* SUPER ADMIN ROUTES */}
      <Route element={<PrivateRoute allowedRole="admin" />}>
        <Route path="/superadmin" element={<SuperAdmin />} />
      </Route>

      {/* ANYTHING ELSE → login */}
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  </Suspense>
);

