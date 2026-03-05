// Header.jsx
import React, { useState } from 'react';
import logo from '../assets/Untitled.png';
import ProfilePopup from './ProfilePopup.jsx';

export default function Header({ currentPage, setCurrentPage }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const name = localStorage.getItem("userName") || "User";

  const navItems = [
    { id: "home",       label: "Home"        },
    { id: "companies",  label: "Companies"   },
    { id: "securities", label: "Security"    },
    { id: "bookings",   label: "My Bookings" },
  ];

  return (
    <>
      <header className="bg-black shadow-lg relative z-50">
        <div className="flex items-center justify-between px-4 py-2">

          {/* Logo */}
          <img src={logo} alt="Logo" className="h-16 w-auto object-contain" />

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                  currentPage === item.id
                    ? "bg-white text-gray-800"
                    : "bg-blue-300 text-white hover:bg-blue-200"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-10 h-10 rounded-full bg-blue-700 hover:bg-blue-500
                flex items-center justify-center text-white font-bold text-base
                border-2 border-blue-400 transition duration-300
                hover:shadow-[0_0_20px_rgba(168,85,247,0.6)]"
            >
              {name.charAt(0).toUpperCase()}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-white text-2xl w-10 h-10 flex items-center justify-center"
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-black/95 border-t border-blue-500/20 px-4 py-3 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setCurrentPage(item.id); setMenuOpen(false); }}
                className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition-colors text-sm ${
                  currentPage === item.id
                    ? "bg-white text-gray-800"
                    : "bg-blue-500/20 text-white hover:bg-blue-500/40"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {profileOpen && <ProfilePopup onClose={() => setProfileOpen(false)} />}
    </>
  );
}