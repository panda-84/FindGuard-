// pages/private/admin/SuperAdminDash.jsx

import React, { useState, useEffect } from "react";
import { useApi } from "../../../hooks/useAPI";
import bgImage from "../../../assets/image.png";

export default function SuperAdminDash() {
  const { callApi } = useApi();
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [menuOpen,    setMenuOpen]    = useState(false);

  const [companies, setCompanies] = useState([]);
  const [guards,    setGuards]    = useState([]);
  const [bookings,  setBookings]  = useState([]);
  const [allUsers,  setAllUsers]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [message,   setMessage]   = useState("");
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    let debug = "";

    // ── COMPANIES ──
    try {
      const res = await callApi("GET", "/companies/all");
      console.log("✅ Companies response:", res);
      const data = res?.data?.data || [];
      setCompanies(data);
      debug += `Companies: ${data.length} | `;
    } catch (e) {
      console.error("❌ Companies failed:", e);
      debug += `Companies ERROR: ${e.message} | `;
    }

    // ── GUARDS ──
    try {
      const res = await callApi("GET", "/guards/all");
      console.log("✅ Guards response:", res);
      const data = res?.data?.data || [];
      setGuards(data);
      debug += `Guards: ${data.length} | `;
    } catch (e) {
      console.error("❌ Guards failed:", e);
      debug += `Guards ERROR: ${e.message} | `;
    }

    // ── BOOKINGS ──
    try {
      const res = await callApi("GET", "/bookings/all");
      console.log("✅ Bookings response:", res);
      const data = res?.data?.data || [];
      setBookings(data);
      debug += `Bookings: ${data.length} | `;
    } catch (e) {
      console.error("❌ Bookings failed:", e);
      debug += `Bookings ERROR: ${e.message} | `;
    }

    // ── USERS ──
    try {
      const res = await callApi("GET", "/auth/users");
      console.log("✅ Users response:", res);
      const data = res?.data?.data || [];
      setAllUsers(data);
      debug += `Users: ${data.length}`;
    } catch (e) {
      console.error("❌ Users failed:", e);
      debug += `Users ERROR: ${e.message}`;
    }

    setDebugInfo(debug);
    setLoading(false);
  };

  const customers    = allUsers.filter(u => u.role === "customer");
  const companyUsers = allUsers.filter(u => u.role === "company");
  const pending      = companies.filter(c => c.status === "pending").length;
  const approved     = companies.filter(c => c.status === "approved").length;
  const rejected     = companies.filter(c => c.status === "rejected").length;

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleApprove = async (id) => {
    try {
      await callApi("PATCH", `/companies/${id}/approve`);
      showMessage("✅ Company approved!");
      loadAll();
    } catch (err) { showMessage("❌ " + err.message); }
  };

  const handleReject = async (id) => {
    try {
      await callApi("PATCH", `/companies/${id}/reject`);
      showMessage("Company rejected!");
      loadAll();
    } catch (err) { showMessage("❌ " + err.message); }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  const statusStyle = (s) => {
    if (s === "approved" || s === "confirmed") return "bg-green-400/20 text-green-400 border-green-400/30";
    if (s === "rejected" || s === "cancelled") return "bg-red-400/20 text-red-400 border-red-400/30";
    return "bg-yellow-400/20 text-yellow-400 border-yellow-400/30";
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard",  icon: "⊞" },
    { id: "companies", label: "Companies",  icon: "🏢" },
    { id: "guards",    label: "All Guards", icon: "🛡" },
    { id: "bookings",  label: "Bookings",   icon: "📋" },
    { id: "customers", label: "Users",      icon: "👥" },
  ];

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="min-h-screen w-full bg-black/60 flex">

        {/* SIDEBAR */}
        <aside className="hidden md:flex w-56 flex-col
          bg-black/40 backdrop-blur-md border-r border-purple-500/20">

          <div className="px-5 py-6 border-b border-purple-500/20">
            <p className="text-white font-black text-lg">👑 Super Admin</p>
            <p className="text-purple-300 text-xs mt-1">FindGuard Control</p>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => (
              <button key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                  text-sm font-semibold transition-all text-left ${
                  currentPage === item.id
                    ? "bg-purple-700/50 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                    : "text-purple-300 hover:text-white hover:bg-purple-500/20"
                }`}>
                <span>{item.icon}</span>
                {item.label}
                {item.id === "companies" && pending > 0 && (
                  <span className="ml-auto bg-yellow-500 text-black text-xs
                    font-black px-2 py-0.5 rounded-full">{pending}</span>
                )}
              </button>
            ))}
          </nav>

          <div className="px-3 py-4 border-t border-purple-500/20">
            <button onClick={handleLogout}
              className="w-full px-3 py-2.5 rounded-xl text-sm font-semibold
                text-red-400 hover:bg-red-500/10 transition text-left">
              🚪 Logout
            </button>
          </div>
        </aside>

        {/* MOBILE HEADER */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50
          bg-black/80 backdrop-blur-md border-b border-purple-500/20
          px-4 py-3 flex justify-between items-center">
          <p className="text-white font-black">👑 Super Admin</p>
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white text-xl">
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden fixed top-12 left-0 right-0 z-40
            bg-black/90 backdrop-blur-md px-4 py-3 space-y-2">
            {navItems.map((item) => (
              <button key={item.id}
                onClick={() => { setCurrentPage(item.id); setMenuOpen(false); }}
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

          {/* DEBUG INFO - remove later */}
          {debugInfo && (
            <div className="mb-4 bg-gray-800 border border-gray-600 rounded-xl p-3 text-xs text-green-400 font-mono">
              🔍 Debug: {debugInfo}
            </div>
          )}

          {message && (
            <div className="mb-4 bg-purple-500/20 border border-purple-400/30
              rounded-xl p-3 text-center text-white">{message}</div>
          )}

          {loading && (
            <p className="text-purple-300 text-center mt-10">Loading data...</p>
          )}

          {/* DASHBOARD */}
          {!loading && currentPage === "dashboard" && (
            <div className="space-y-6">
              <h1 className="text-2xl md:text-3xl font-bold text-white">System Overview 👑</h1>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Total Companies", value: companies.length, color: "from-blue-700 to-blue-900"     },
                  { label: "Pending Approval",value: pending,          color: "from-yellow-700 to-yellow-900" },
                  { label: "Total Guards",    value: guards.length,    color: "from-green-700 to-green-900"   },
                  { label: "Total Bookings",  value: bookings.length,  color: "from-purple-700 to-purple-900" },
                ].map((stat) => (
                  <div key={stat.label}
                    className={`bg-gradient-to-br ${stat.color} rounded-2xl p-5 shadow-lg
                      hover:scale-105 transform transition-all`}>
                    <p className="text-3xl font-black text-white">{stat.value}</p>
                    <p className="text-blue-200 text-sm mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Pending Companies */}
              {pending > 0 && (
                <div className="bg-black/20 backdrop-blur-md rounded-3xl p-6
                  border border-yellow-500/30">
                  <h2 className="text-lg font-bold text-yellow-400 mb-4">
                    ⚠️ Waiting For Approval ({pending})
                  </h2>
                  <div className="space-y-3">
                    {companies.filter(c => c.status === "pending").map((c) => (
                      <div key={c.id}
                        className="flex flex-col sm:flex-row sm:items-center gap-3
                          bg-yellow-900/20 rounded-xl p-4 border border-yellow-500/20">
                        <div className="flex-1">
                          <p className="text-white font-bold">{c.name}</p>
                          <p className="text-yellow-300 text-sm">{c.location}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleApprove(c.id)}
                            className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-bold rounded-lg transition">
                            ✅ Approve
                          </button>
                          <button onClick={() => handleReject(c.id)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-lg transition">
                            ✕ Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Bookings */}
              <div className="bg-black/20 backdrop-blur-md rounded-3xl p-6">
                <h2 className="text-lg font-bold text-white mb-4">Recent Bookings</h2>
                {bookings.length === 0 ? (
                  <p className="text-purple-300 text-sm">No bookings yet.</p>
                ) : (
                  <div className="space-y-3">
                    {bookings.slice(0, 5).map((b) => (
                      <div key={b.id}
                        className="flex flex-col sm:flex-row sm:items-center gap-2
                          bg-purple-900/20 rounded-xl p-4 border border-purple-500/20">
                        <div className="flex-1">
                          <p className="text-white font-bold">{b.contactName}</p>
                          <p className="text-purple-300 text-sm">🛡 {b.guard?.name} · 🏢 {b.company?.name}</p>
                          <p className="text-purple-300 text-sm">📅 {b.startDate?.slice(0,10)}</p>
                        </div>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full border w-fit ${statusStyle(b.status)}`}>
                          {b.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* COMPANIES */}
          {!loading && currentPage === "companies" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h1 className="text-2xl font-bold text-white">All Companies ({companies.length})</h1>
                <div className="flex gap-2 text-xs">
                  <span className="bg-yellow-400/20 text-yellow-400 px-2 py-1 rounded-full font-bold">Pending: {pending}</span>
                  <span className="bg-green-400/20 text-green-400 px-2 py-1 rounded-full font-bold">Approved: {approved}</span>
                  <span className="bg-red-400/20 text-red-400 px-2 py-1 rounded-full font-bold">Rejected: {rejected}</span>
                </div>
              </div>

              {companies.length === 0 && (
                <div className="bg-black/20 backdrop-blur-md rounded-3xl p-10 text-center">
                  <p className="text-purple-300">No companies registered yet.</p>
                </div>
              )}

              {companies.map((c) => (
                <div key={c.id}
                  className="bg-black/20 backdrop-blur-md rounded-2xl p-5
                    border border-purple-500/20 hover:border-purple-400/40 transition">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="w-14 h-14 bg-purple-700 rounded-full flex items-center
                      justify-center border-2 border-purple-400 flex-shrink-0">
                      <span className="text-white font-bold text-xl">{c.name?.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-bold text-lg">{c.name}</p>
                      <p className="text-purple-300 text-sm">{c.location}</p>
                      <p className="text-purple-200 text-sm">{c.description}</p>
                      {c.user && (
                        <p className="text-purple-400 text-xs mt-1">
                          👤 {c.user?.name} · {c.user?.email}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusStyle(c.status)}`}>
                        {c.status}
                      </span>
                      {c.status === "pending" && (
                        <div className="flex gap-2">
                          <button onClick={() => handleApprove(c.id)}
                            className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-bold rounded-lg transition">
                            ✅ Approve
                          </button>
                          <button onClick={() => handleReject(c.id)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-lg transition">
                            ✕ Reject
                          </button>
                        </div>
                      )}
                      {c.status === "approved" && (
                        <button onClick={() => handleReject(c.id)}
                          className="px-4 py-2 bg-red-600/50 hover:bg-red-600 text-white text-sm font-bold rounded-lg transition">
                          ✕ Revoke
                        </button>
                      )}
                      {c.status === "rejected" && (
                        <button onClick={() => handleApprove(c.id)}
                          className="px-4 py-2 bg-green-600/50 hover:bg-green-600 text-white text-sm font-bold rounded-lg transition">
                          ✅ Re-Approve
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* GUARDS */}
          {!loading && currentPage === "guards" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-white">All Guards ({guards.length})</h1>
              {guards.length === 0 ? (
                <div className="bg-black/20 backdrop-blur-md rounded-3xl p-10 text-center">
                  <p className="text-purple-300">No guards yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {guards.map((g) => (
                    <div key={g.id}
                      className="bg-gradient-to-br from-blue-700 via-blue-900 to-indigo-900
                        rounded-xl p-5 shadow-lg hover:scale-[1.02] transform transition-all">
                      <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center
                        justify-center mx-auto mb-3 border-2 border-white">
                        <span className="text-white font-bold text-2xl">{g.name?.charAt(0)}</span>
                      </div>
                      <h3 className="text-white font-bold text-center">{g.name}</h3>
                      <p className="text-blue-200 text-sm text-center">{g.company?.name}</p>
                      <p className="text-blue-300 text-sm text-center">{g.shift} · {g.zone || "N/A"}</p>
                      <div className="flex justify-between mt-3">
                        <span className="text-yellow-400 text-sm">★ {g.rating}</span>
                        <span className="text-green-300 font-semibold text-sm">${g.price}/hr</span>
                      </div>
                      <div className="flex justify-center mt-2">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusStyle(g.status)}`}>
                          {g.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* BOOKINGS */}
          {!loading && currentPage === "bookings" && (
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-white">All Bookings ({bookings.length})</h1>
              {bookings.length === 0 ? (
                <div className="bg-black/20 backdrop-blur-md rounded-3xl p-10 text-center">
                  <p className="text-purple-300">No bookings yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((b) => (
                    <div key={b.id}
                      className="bg-black/20 backdrop-blur-md rounded-2xl p-5
                        border border-purple-500/20 hover:border-purple-400/40 transition">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-1 space-y-1">
                          <p className="text-white font-bold">{b.contactName}</p>
                          <p className="text-purple-300 text-sm">🛡 {b.guard?.name} · 🏢 {b.company?.name}</p>
                          <p className="text-purple-300 text-sm">👤 {b.customer?.name}</p>
                          <p className="text-purple-300 text-sm">📅 {b.startDate?.slice(0,10)} · ⏱ {b.duration} {b.durationType}</p>
                          <p className="text-green-300 font-semibold">Rs {Number(b.totalCost)?.toLocaleString()}</p>
                        </div>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full border w-fit ${statusStyle(b.status)}`}>
                          {b.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* USERS */}
          {!loading && currentPage === "customers" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-white">All Users ({allUsers.length})</h1>
              <div className="flex gap-3 flex-wrap">
                <span className="bg-blue-400/20 text-blue-400 px-3 py-1 rounded-full text-sm font-bold">
                  👤 Customers: {customers.length}
                </span>
                <span className="bg-green-400/20 text-green-400 px-3 py-1 rounded-full text-sm font-bold">
                  🏢 Companies: {companyUsers.length}
                </span>
              </div>
              {allUsers.length === 0 ? (
                <div className="bg-black/20 backdrop-blur-md rounded-3xl p-10 text-center">
                  <p className="text-purple-300">No users found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {allUsers.map((u) => (
                    <div key={u.id}
                      className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50
                        rounded-xl p-5 border border-purple-500/20
                        hover:border-purple-400/40 transition">
                      <div className="w-14 h-14 bg-purple-700 rounded-full flex items-center
                        justify-center mx-auto mb-3 border-2 border-purple-400">
                        <span className="text-white font-bold text-xl">{u.name?.charAt(0)}</span>
                      </div>
                      <p className="text-white font-bold text-center">{u.name}</p>
                      <p className="text-purple-300 text-sm text-center">{u.email}</p>
                      <p className="text-purple-300 text-sm text-center">{u.phone || "N/A"}</p>
                      <div className="flex justify-center mt-2">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          u.role === "admin"   ? "bg-purple-400/20 text-purple-400" :
                          u.role === "company" ? "bg-blue-400/20 text-blue-400" :
                          "bg-green-400/20 text-green-400"
                        }`}>
                          {u.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}