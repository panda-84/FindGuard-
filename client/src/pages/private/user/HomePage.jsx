// pages/private/user/HomePage.jsx

import React, { useState, useEffect } from "react";
import { useApi } from "../../../hooks/useAPI";
import bgImage from "../../../assets/ads/home.png";

export default function HomePage() {
  const { callApi } = useApi();
  const [stats,   setStats]   = useState({ companies: 0, guards: 0, bookings: 0 });
  const [loading, setLoading] = useState(true);

  const name = localStorage.getItem("userName") || "there";

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    try {
      const [compRes, guardRes] = await Promise.all([
        callApi("GET", "/companies"),
        callApi("GET", "/guards"),
      ]);

      // Load bookings separately so it doesn't block other stats
      let bookingCount = 0;
      try {
        const bookRes = await callApi("GET", "/profile/bookings");
        bookingCount = bookRes?.data?.data?.length || 0;
      } catch (e) {}

      setStats({
        companies: compRes?.data?.data?.length  || 0,
        guards:    guardRes?.data?.data?.length || 0,
        bookings:  bookingCount,
      });
    } catch (err) {
      console.error("Load stats error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: "Security Companies", value: stats.companies, icon: "🏢", color: "from-blue-700 to-blue-900"     },
    { label: "Available Guards",   value: stats.guards,    icon: "🛡", color: "from-green-700 to-green-900"   },
    { label: "My Bookings",        value: stats.bookings,  icon: "📋", color: "from-purple-700 to-purple-900" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black">
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-8">

        {/* Welcome */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Welcome back, {name} 👋
          </h1>
          <p className="text-blue-300 text-lg">Your security management portal</p>
        </div>

         <div className="bg-gray-500 h-50 rounded-lg mb-12">
                  <img src={bgImage} alt="Company Header" className="w-full h-full object-cover rounded-lg" />
                </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statCards.map((stat) => (
            <div key={stat.label}
              className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 shadow-lg
                hover:scale-105 transform transition-all
                hover:shadow-[0_0_20px_rgba(168,85,248,0.4)]`}>
              <p className="text-4xl mb-2">{stat.icon}</p>
              <p className="text-4xl font-black text-white">
                {loading ? "..." : stat.value}
              </p>
              <p className="text-blue-200 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* About */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8
          border border-white/10 shadow-[0_0_30px_rgba(168,85,248,0.2)]">
          <h2 className="text-2xl font-bold text-white mb-4">About FindGuard</h2>
          <p className="text-blue-200 leading-relaxed">
            FindGuard brings all security companies to one portal, making security
            management easy and efficient. Browse verified companies, view available
            guards, and book professional security services in just a few clicks.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { icon: "🔍", title: "Browse Companies", desc: "Explore verified security companies and their available guards.",         color: "from-blue-800/50 to-blue-900/50"   },
            { icon: "🛡", title: "Book a Guard",     desc: "Easily book professional security guards for any duration.",              color: "from-green-800/50 to-green-900/50" },
            { icon: "📋", title: "Track Bookings",   desc: "Monitor all your bookings and their confirmation status.",                color: "from-purple-800/50 to-purple-900/50"},
            { icon: "⭐", title: "Trusted Security", desc: "All companies are verified and approved by our admin team.",              color: "from-yellow-800/50 to-yellow-900/50"},
          ].map((f) => (
            <div key={f.title}
              className={`bg-gradient-to-br ${f.color} rounded-2xl p-6
                border border-white/10 hover:border-white/20 transition
                hover:shadow-[0_0_20px_rgba(168,85,248,0.3)]`}>
              <p className="text-3xl mb-3">{f.icon}</p>
              <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-blue-200 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}