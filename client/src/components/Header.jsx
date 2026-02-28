// components/Header.jsx

import React, { useState } from 'react';
import logo from '../assets/Untitled.png';
import ProfilePopup from './ProfilePopup.jsx';

export default function Header({ currentPage, setCurrentPage }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const name = localStorage.getItem("userName") || "User";

  const navItems = [
    { id: "home",       label: "Home"        },
    { id: "companies",  label: "Companies"   },
    { id: "securities", label: "Security"    },
    { id: "bookings",   label: "My Bookings" },
  ];

  return (
    <>
      <header className="bg-black shadow-lg h-[160px] flex items-center relative z-50">
        <div className="flex items-center w-full px-4">

          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img src={logo} alt="Logo" className="h-[200px] w-[150px]" />
          </div>

          {/* Nav */}
          <nav className="space-x-4 ml-[200px] flex items-center">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`px-5 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === item.id
                    ? "bg-white text-gray-800"
                    : "bg-blue-300 text-white hover:bg-blue-200"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Profile Button */}
          <div className="ml-auto">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-16 h-11 mr-10 rounded-full bg-blue-700 hover:bg-blue-500
                flex items-center justify-center text-white font-bold text-lg
                border-2 border-blue-400
                hover:shadow-[0_0_20px_rgba(168,85,247,0.6)]
                transition duration-300"
            >
              {name.charAt(0).toUpperCase()}
            </button>
          </div>

        </div>
      </header>

      {profileOpen && (
        <ProfilePopup onClose={() => setProfileOpen(false)} />
      )}
    </>
  );
}