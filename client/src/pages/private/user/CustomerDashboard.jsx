// pages/private/user/CustomerDashboard.jsx

import React, { useState } from "react";
import Header        from "../../../components/Header";
import HomePage      from "./HomePage";
import CompaniesPage from "./companies";
import SecuritiesPage from "./allSecurities";
import MyBookings    from "./MyBookings";
import bgImage from "../../../assets/image.png";

export default function CustomerDashboard() {
  const [currentPage, setCurrentPage] = useState("home");

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="min-h-screen w-full bg-black/50">
        <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

        <div>
          {currentPage === "home"       && <HomePage />}
          {currentPage === "companies"  && <CompaniesPage />}
          {currentPage === "securities" && <SecuritiesPage />}
          {currentPage === "bookings"   && <MyBookings />}
        </div>
      </div>
    </div>
  );
}