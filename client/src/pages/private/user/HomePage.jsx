// HomePage.jsx
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6 sm:space-y-8">

        {/* Welcome */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-3">
            Welcome back, {name} 👋
          </h1>
          <p className="text-blue-300 text-sm sm:text-lg">Your security management portal</p>
        </div>

        {/* Banner */}
        <div className="h-32 sm:h-48 rounded-xl overflow-hidden">
          <img src={bgImage} alt="Banner" className="w-full h-full object-cover" />
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {statCards.map((stat) => (
            <div key={stat.label}
              className={`bg-gradient-to-br ${stat.color} rounded-2xl p-5 sm:p-6 shadow-lg
                hover:scale-105 transform transition-all
                hover:shadow-[0_0_20px_rgba(168,85,248,0.4)]`}>
              <p className="text-3xl sm:text-4xl mb-2">{stat.icon}</p>
              <p className="text-3xl sm:text-4xl font-black text-white">
                {loading ? "..." : stat.value}
              </p>
              <p className="text-blue-200 text-xs sm:text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* About */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 sm:p-8
          border border-white/10 shadow-[0_0_30px_rgba(168,85,248,0.2)]">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">About FindGuard</h2>
          <p className="text-blue-200 leading-relaxed text-sm sm:text-base">
            FindGuard brings all security companies to one portal, making security
            management easy and efficient. Browse verified companies, view available
            guards, and book professional security services in just a few clicks.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {[
            { icon: "🔍", title: "Browse Companies", desc: "Explore verified security companies and their available guards.",    color: "from-blue-800/50 to-blue-900/50"    },
            { icon: "🛡", title: "Book a Guard",     desc: "Easily book professional security guards for any duration.",         color: "from-green-800/50 to-green-900/50"  },
            { icon: "📋", title: "Track Bookings",   desc: "Monitor all your bookings and their confirmation status.",           color: "from-purple-800/50 to-purple-900/50" },
            { icon: "⭐", title: "Trusted Security", desc: "All companies are verified and approved by our admin team.",         color: "from-yellow-800/50 to-yellow-900/50" },
          ].map((f) => (
            <div key={f.title}
              className={`bg-gradient-to-br ${f.color} rounded-2xl p-5 sm:p-6
                border border-white/10 hover:border-white/20 transition
                hover:shadow-[0_0_20px_rgba(168,85,248,0.3)]`}>
              <p className="text-2xl sm:text-3xl mb-2 sm:mb-3">{f.icon}</p>
              <h3 className="text-white font-bold text-base sm:text-lg mb-1 sm:mb-2">{f.title}</h3>
              <p className="text-blue-200 text-xs sm:text-sm">{f.desc}</p>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}