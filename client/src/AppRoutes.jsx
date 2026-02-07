

import React, { Suspense, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { PublicRoute } from "./routes/PublicRoute";
import { PrivateRoute } from "./routes/PrivateRoute";

import LoginPage from "./pages/public/log";
import SignupPage from "./pages/public/reg";
import ForgetPassword from "./pages/public/fog";

import Header from "./components/Header";
import HomePage from "./pages/private/HomePage";
import CompaniesPage from "./pages/private/CompaniesPage";
import SecuritiesPage from "./pages/private/SecuritiesPage";

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCompany, setSelectedCompany] = useState(null);

  return (
    <div>
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'companies' && (
        <CompaniesPage 
          selectedCompany={selectedCompany}
          setSelectedCompany={setSelectedCompany}
        />
      )}
      {currentPage === 'securities' && <SecuritiesPage />}
    </div>
  );
};

export const AppRoutes = () => (
  <Suspense fallback={<div>...Loading</div>}>
    <Routes>

      {/* 👉 ROOT PATH → LOGIN */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* PUBLIC ROUTES */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
      </Route>

      {/* PRIVATE ROUTES */}
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        
      </Route>

      {/* CATCH ALL */}
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  </Suspense>
);
