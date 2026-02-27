// ComDash.jsx
// Company admin dashboard - shows stats and navigation

import React, { useState, useEffect } from "react";
import { useApi } from "../../../hooks/useAPI";
import bgImage from "../../../assets/image.png";
import GuardPage  from "./guardPage";
import BookingPage from "./booking";

export default function ComDash() {
  const { callApi } = useApi();
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [company,     setCompany]     = useState(null);
  const [guards,      setGuards]      = useState([]);
  const [bookings,    setBookings]    = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [compRes, guardRes, bookRes] = await Promise.all([
        callApi("GET", "/companies/mine"),
        callApi("GET", "/guards/mine"),
        callApi("GET", "/bookings/company"),
      ]);
      setCompany(compRes?.data?.data);
      setGuards(guardRes?.data?.data  || []);
      setBookings(bookRes?.data?.data || []);
    } catch (err) {
      console.error("Failed to load data:", err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "⊞" },
    { id: "guards",    label: "Guards",    icon: "🛡" },
    { id: "bookings",  label: "Bookings",  icon: "📋" },
  ];

  // Stats
  const totalGuards    = guards.length;
  const available      = guards.filter(g => g.status === "available").length;
  const pendingBook    = bookings.filter(b => b.status === "pending").length;
  const confirmedBook  = bookings.filter(b => b.status === "confirmed").length;

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="min-h-screen w-full bg-black/60 flex">

        {/* ── SIDEBAR (desktop) ── */}
        <aside className="hidden md:flex w-56 flex-col
          bg-black/40 backdrop-blur-md border-r border-blue-500/20">

          {/* Brand */}
          <div className="px-5 py-6 border-b border-blue-500/20">
            <p className="text-white font-black text-lg">🛡 GuardOps</p>
            <p className="text-blue-300 text-xs mt-1">
              {company?.name || "Company Admin"}
            </p>
            {/* Status badge */}
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full mt-2 inline-block ${
              company?.status === "approved"
                ? "bg-green-400/20 text-green-400"
                : "bg-yellow-400/20 text-yellow-400"
            }`}>
              {company?.status || "pending"}
            </span>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                  text-sm font-semibold transition-all text-left ${
                  currentPage === item.id
                    ? "bg-blue-700/50 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                    : "text-blue-300 hover:text-white hover:bg-blue-500/20"
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          {/* Logout */}
          <div className="px-3 py-4 border-t border-blue-500/20">
            <button
              onClick={handleLogout}
              className="w-full px-3 py-2.5 rounded-xl text-sm font-semibold
                text-red-400 hover:bg-red-500/10 transition text-left"
            >
              🚪 Logout
            </button>
          </div>
        </aside>

        {/* ── MOBILE HEADER ── */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50
          bg-black/80 backdrop-blur-md border-b border-blue-500/20
          px-4 py-3 flex justify-between items-center">
          <p className="text-white font-black">🛡 GuardOps</p>
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white text-xl">
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden fixed top-12 left-0 right-0 z-40
            bg-black/90 backdrop-blur-md border-b border-blue-500/20 px-4 py-3 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setCurrentPage(item.id); setMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-xl text-white text-sm hover:bg-blue-500/20"
              >
                {item.icon} {item.label}
              </button>
            ))}
            <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-xl text-red-400 text-sm">
              🚪 Logout
            </button>
          </div>
        )}

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto mt-12 md:mt-0">

          {/* DASHBOARD PAGE */}
          {currentPage === "dashboard" && (
            <div className="space-y-6">
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Welcome, {company?.name || "Company"} 👋
              </h1>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Total Guards",      value: totalGuards,   color: "from-blue-700 to-blue-900"   },
                  { label: "Available",          value: available,     color: "from-green-700 to-green-900" },
                  { label: "Pending Bookings",   value: pendingBook,   color: "from-yellow-700 to-yellow-900"},
                  { label: "Confirmed Bookings", value: confirmedBook, color: "from-purple-700 to-purple-900"},
                ].map((stat) => (
                  <div key={stat.label}
                    className={`bg-gradient-to-br ${stat.color}
                      rounded-2xl p-5 shadow-lg
                      hover:scale-105 transform transition-all
                      hover:shadow-[0_0_20px_rgba(168,85,248,0.4)]`}
                  >
                    <p className="text-3xl font-black text-white">{stat.value}</p>
                    <p className="text-blue-200 text-sm mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Recent Bookings */}
              <div className="bg-black/20 backdrop-blur-md rounded-3xl p-6
                shadow-[0_0_30px_rgba(168,85,248,0.25)]">
                <h2 className="text-lg font-bold text-white mb-4">Recent Bookings</h2>

                {bookings.length === 0 ? (
                  <p className="text-blue-300 text-sm">No bookings yet.</p>
                ) : (
                  <div className="space-y-3">
                    {bookings.slice(0, 5).map((b) => (
                      <div key={b.id}
                        className="flex flex-col sm:flex-row sm:items-center gap-2
                          bg-blue-900/30 rounded-xl p-4 border border-blue-500/20">
                        <div className="flex-1">
                          <p className="text-white font-bold">{b.contactName}</p>
                          <p className="text-blue-300 text-sm">{b.guard?.name} · {b.startDate?.slice(0,10)}</p>
                        </div>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full w-fit ${
                          b.status === "confirmed" ? "bg-green-400/20 text-green-400" :
                          b.status === "cancelled" ? "bg-red-400/20 text-red-400" :
                          "bg-yellow-400/20 text-yellow-400"
                        }`}>
                          {b.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* GUARDS PAGE */}
          {currentPage === "guards" && <GuardPage />}

          {/* BOOKINGS PAGE */}
          {currentPage === "bookings" && <BookingPage />}

        </main>
      </div>
    </div>
  );
}