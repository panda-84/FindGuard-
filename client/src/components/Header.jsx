// Header.jsx
// Uses separate ProfilePopup component

import React, { useState } from 'react';
import logo from '../assets/Untitled.png';
import ProfilePopup from './ProfilePopup';

export default function Header({ currentPage, setCurrentPage }) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <>
      <header className="bg-black shadow-lg h-[160px] flex items-center relative z-50">
        <div className="flex items-center w-full px-4">

          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img src={logo} alt="Logo" className="h-[200px] w-[150px]" />
          </div>

          {/* Nav Buttons */}
          <nav className="space-x-9 ml-[350px]">
            <button
              onClick={() => setCurrentPage('home')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                currentPage === 'home'
                  ? 'bg-white text-gray-800'
                  : 'bg-blue-300 text-white hover:bg-blue-200'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => setCurrentPage('companies')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                currentPage === 'companies'
                  ? 'bg-white text-gray-800'
                  : 'bg-blue-300 text-white hover:bg-blue-200'
              }`}
            >
              Companies
            </button>

            <button
              onClick={() => setCurrentPage('securities')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                currentPage === 'securities'
                  ? 'bg-white text-gray-800'
                  : 'bg-blue-300 text-white hover:bg-blue-200'
              }`}
            >
              Security
            </button>
          </nav>

          {/* Profile Button */}
          <div className="ml-auto">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-11 h-11 rounded-full bg-blue-700 hover:bg-blue-500
                flex items-center justify-center text-white font-bold text-lg
                border-2 border-blue-400
                hover:shadow-[0_0_20px_rgba(168,85,247,0.6)]
                transition duration-300"
            >
              👤
            </button>
          </div>

        </div>
      </header>

      {/* Profile Popup */}
      {profileOpen && (
        <ProfilePopup onClose={() => setProfileOpen(false)} />
      )}
    </>
  );
}