import React from 'react';
import logo from '../assets/Untitled.png';

export default function Header({ currentPage, setCurrentPage }) {
  return (
    <header className="bg-blue-500 shadow-md h-[150px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Logo" className="h-[200px] w-[150px]" />
        </div>
        <nav className="flex space-x-2">
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
      </div>
    </header>
  );
}
