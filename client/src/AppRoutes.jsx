// AppRoutes.jsx
// Updated with your exact file names

import React, { Suspense, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { PublicRoute }  from "./routes/PublicRoute";
import { PrivateRoute } from "./routes/PrivateRoute";

// ── PUBLIC PAGES ──────────────────────────────
import LoginPage      from "./pages/public/log";
import SignupPage     from "./pages/public/reg";
import ForgetPassword from "./pages/public/fog";

// ── CUSTOMER PAGES (pages/private/user/) ──────
import HomePage       from "./pages/private/user/HomePage";
import CompaniesPage  from "./pages/private/user/companies";        // ✅ renamed
import SecuritiesPage from "./pages/private/user/allSecurities";    // ✅ renamed

// ── COMPANY PAGES (pages/private/company/) ────
import ComDash     from "./pages/private/company/ComDash";
import GuardPage   from "./pages/private/company/guardPage";
import BookingPage from "./pages/private/company/booking";

// ── HEADER ────────────────────────────────────
import Header from "./components/Header";

import bgImage from "./assets/image.png";

// ─────────────────────────────────────────────
// CUSTOMER DASHBOARD
// ─────────────────────────────────────────────
const CustomerDashboard = () => {
  const [currentPage, setCurrentPage] = useState("home");

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="min-h-screen w-full bg-black/50">

        {/* Your existing Header */}
        <Header
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />

        {/* Page Content */}
        <div className="px-4 py-8">
          {currentPage === "home"       && <HomePage />}
          {currentPage === "companies"  && <CompaniesPage />}
          {currentPage === "securities" && <SecuritiesPage />}
        </div>

      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// SUPER ADMIN (placeholder)
// ─────────────────────────────────────────────
const SuperAdmin = () => {
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="min-h-screen bg-black/50 flex items-center justify-center">
        <div className="p-10 rounded-3xl text-center
          bg-black/20 backdrop-blur-md
          shadow-[0_0_30px_rgba(168,85,248,0.25)]
          hover:shadow-[0_0_60px_rgba(168,85,248,0.9)]
          transition duration-1000">
          <h1 className="text-3xl font-bold text-white mb-3">👑 Super Admin</h1>
          <p className="text-blue-200 mb-6">Full panel coming soon...</p>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500/80 hover:bg-red-500 text-white rounded-3xl font-bold transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// ALL ROUTES
// ─────────────────────────────────────────────
export const AppRoutes = () => (
  <Suspense fallback={
    <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-white text-xl">Loading...</p>
    </div>
  }>
    <Routes>

      {/* ROOT → login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* PUBLIC ROUTES */}
      <Route element={<PublicRoute />}>
        <Route path="/login"           element={<LoginPage />} />
        <Route path="/register"        element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
      </Route>

      {/* CUSTOMER ROUTES */}
      <Route element={<PrivateRoute allowedRole="customer" />}>
        <Route path="/dashboard" element={<CustomerDashboard />} />
      </Route>

      {/* COMPANY ROUTES */}
      <Route element={<PrivateRoute allowedRole="company" />}>
        <Route path="/admin"          element={<ComDash />} />
        <Route path="/admin/guards"   element={<GuardPage />} />
        <Route path="/admin/bookings" element={<BookingPage />} />
      </Route>

      {/* SUPER ADMIN ROUTES */}
      <Route element={<PrivateRoute allowedRole="admin" />}>
        <Route path="/superadmin" element={<SuperAdmin />} />
      </Route>

      {/* CATCH ALL */}
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  </Suspense>
);