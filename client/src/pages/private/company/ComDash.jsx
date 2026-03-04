import React, { useState, useEffect } from "react";
import { useApi } from "../../../hooks/useAPI";
import bgImage from "../../../assets/image.png";
import GuardPage   from "./guardPage";
import BookingPage from "./booking";

export default function ComDash() {
  const { callApi } = useApi();
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [company,     setCompany]     = useState(null);
  const [guards,      setGuards]      = useState([]);
  const [bookings,    setBookings]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [message,     setMessage]     = useState("");
  const [setupForm,   setSetupForm]   = useState({ name: "", location: "", description: "" });
  const [setupLoading, setSetupLoading] = useState(false);

  useEffect(() => { loadData(); }, []);
  const loadData = async () => {
    setLoading(true);
    try {
      const compRes = await callApi("GET", "/companies/mine");
      setCompany(compRes?.data?.data);
    } catch (err) {
      setCompany(null);
    }
    try {
      const guardRes = await callApi("GET", "/guards/mine");
      setGuards(guardRes?.data?.data || []);
    } catch (err) {}
    try {
      const bookRes = await callApi("GET", "/bookings/company");
      setBookings(bookRes?.data?.data || []);
    } catch (err) {}
    setLoading(false);
  };
  const handleSetup = async () => {
    if (!setupForm.name) { setMessage("Company name is required!"); return; }
    setSetupLoading(true);
    try {
      const res = await callApi("POST", "/companies", { data: setupForm });
      setMessage("✅ Company created! Waiting for admin approval.");
      setCompany(res?.data?.data);
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setSetupLoading(false);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  const inputClass = `w-full px-4 py-3 rounded-xl bg-blue-500/15 text-white
    border-none outline-none placeholder-blue-300/50
    hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition`;

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }
  if (!company) {
    return (
      <div className="min-h-screen w-full bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="min-h-screen bg-black/60 flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-black/30 backdrop-blur-md rounded-3xl p-8
            shadow-[0_0_40px_rgba(168,85,248,0.4)] border border-blue-500/30">
            <h1 className="text-2xl font-bold text-white mb-2 text-center">🛡 Setup Your Company</h1>
            <p className="text-blue-300 text-sm text-center mb-6">
              Fill in your company details. Admin will review and approve.
            </p>
            {message && (
              <div className="mb-4 bg-blue-500/20 border border-blue-400/30 rounded-xl p-3 text-center text-white text-sm">
                {message}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="text-blue-300 text-xs font-bold mb-1 block">Company Name *</label>
                <input value={setupForm.name}
                  onChange={(e) => setSetupForm({ ...setupForm, name: e.target.value })}
                  placeholder="e.g. Alpha Security" className={inputClass} />
              </div>
              <div>
                <label className="text-blue-300 text-xs font-bold mb-1 block">Location</label>
                <input value={setupForm.location}
                  onChange={(e) => setSetupForm({ ...setupForm, location: e.target.value })}
                  placeholder="e.g. Kathmandu, Nepal" className={inputClass} />
              </div>
              <div>
                <label className="text-blue-300 text-xs font-bold mb-1 block">Description</label>
                <textarea value={setupForm.description}
                  onChange={(e) => setSetupForm({ ...setupForm, description: e.target.value })}
                  placeholder="Tell us about your company..." rows={3}
                  className={inputClass + " resize-none"} />
              </div>
              <button onClick={handleSetup} disabled={setupLoading}
                className="w-full py-3 bg-blue-700 hover:bg-blue-500 text-white font-bold
                  rounded-3xl transition hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]
                  disabled:opacity-50">
                {setupLoading ? "Creating..." : "Create Company Profile"}
              </button>
              <button onClick={handleLogout}
                className="w-full py-2 text-red-400 hover:text-red-300 text-sm transition">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  
  if (company?.status === "pending") {
    return (
      <div className="min-h-screen w-full bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="min-h-screen bg-black/60 flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-black/30 backdrop-blur-md rounded-3xl p-8
            shadow-[0_0_40px_rgba(168,85,248,0.4)] border border-yellow-500/30 text-center">
            <p className="text-5xl mb-4">⏳</p>
            <h1 className="text-2xl font-bold text-white mb-2">Waiting for Approval</h1>
            <p className="text-yellow-300 text-sm mb-2">
              <strong>{company.name}</strong> is under review by admin.
            </p>
            <p className="text-blue-300 text-sm mb-6">Please check back later.</p>
            <button onClick={handleLogout}
              className="px-6 py-2 bg-red-500/80 hover:bg-red-500 text-white rounded-3xl font-bold transition">
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  // REJECTED
  if (company?.status === "rejected") {
    return (
      <div className="min-h-screen w-full bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="min-h-screen bg-black/60 flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-black/30 backdrop-blur-md rounded-3xl p-8
            shadow-[0_0_40px_rgba(239,68,68,0.4)] border border-red-500/30 text-center">
            <p className="text-5xl mb-4">❌</p>
            <h1 className="text-2xl font-bold text-white mb-2">Company Rejected</h1>
            <p className="text-red-300 text-sm mb-6">
              <strong>{company.name}</strong> was rejected. Contact support.
            </p>
            <button onClick={handleLogout}
              className="px-6 py-2 bg-red-500/80 hover:bg-red-500 text-white rounded-3xl font-bold transition">
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  // FULL DASHBOARD (approved)
  const totalGuards   = guards.length;
  const available     = guards.filter(g => g.status === "available").length;
  const pendingBook   = bookings.filter(b => b.status === "pending").length;
  const confirmedBook = bookings.filter(b => b.status === "confirmed").length;

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "⊞" },
    { id: "guards",    label: "Guards",    icon: "🛡" },
    { id: "bookings",  label: "Bookings",  icon: "📋" },
  ];

  return (
    <div className="min-h-screen w-full bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="min-h-screen w-full bg-black/60 flex">

        {/* SIDEBAR */}
        <aside className="hidden md:flex w-56 flex-col bg-black/40 backdrop-blur-md border-r border-blue-500/20">
          <div className="px-5 py-6 border-b border-blue-500/20">
            <p className="text-white font-black text-lg">🛡 COMPANY </p>
            <p className="text-blue-300 text-xs mt-1">{company?.name}</p>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full mt-2 inline-block bg-green-400/20 text-green-400">
              {company?.status}
            </span>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                  text-sm font-semibold transition-all text-left ${
                  currentPage === item.id
                    ? "bg-blue-700/50 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                    : "text-blue-300 hover:text-white hover:bg-blue-500/20"
                }`}>
                <span>{item.icon}</span>{item.label}
              </button>
            ))}
          </nav>
          <div className="px-3 py-4 border-t border-blue-500/20">
            <button onClick={handleLogout}
              className="w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition text-left">
              🚪 Logout
            </button>
          </div>
        </aside>

        {/* MOBILE HEADER */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md
          border-b border-blue-500/20 px-4 py-3 flex justify-between items-center">
          <p className="text-white font-black">🛡 {company?.name}</p>
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white text-xl">
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden fixed top-12 left-0 right-0 z-40 bg-black/90 backdrop-blur-md px-4 py-3 space-y-2">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => { setCurrentPage(item.id); setMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-xl text-white text-sm">
                {item.icon} {item.label}
              </button>
            ))}
            <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-xl text-red-400 text-sm">
              🚪 Logout
            </button>
          </div>
        )}

        {/* MAIN */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto mt-12 md:mt-0">

          {currentPage === "dashboard" && (
            <div className="space-y-6">
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Welcome, {company?.name} 👋
              </h1>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Total Guards",      value: totalGuards,   color: "from-blue-700 to-blue-900"     },
                  { label: "Available",          value: available,     color: "from-green-700 to-green-900"   },
                  { label: "Pending Bookings",   value: pendingBook,   color: "from-yellow-700 to-yellow-900" },
                  { label: "Confirmed Bookings", value: confirmedBook, color: "from-purple-700 to-purple-900" },
                ].map((stat) => (
                  <div key={stat.label}
                    className={`bg-gradient-to-br ${stat.color} rounded-2xl p-5 shadow-lg
                      hover:scale-105 transform transition-all hover:shadow-[0_0_20px_rgba(168,85,248,0.4)]`}>
                    <p className="text-3xl font-black text-white">{stat.value}</p>
                    <p className="text-blue-200 text-sm mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-black/20 backdrop-blur-md rounded-3xl p-6 shadow-[0_0_30px_rgba(168,85,248,0.25)]">
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
                          <p className="text-blue-300 text-sm">🛡 {b.guard?.name} · 📅 {b.startDate?.slice(0,10)}</p>
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

          {currentPage === "guards"   && <GuardPage />}
          {currentPage === "bookings" && <BookingPage />}

        </main>
      </div>
    </div>
  );
}