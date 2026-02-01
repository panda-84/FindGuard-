import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import logo from '../../assets/Untitled.png';

export default function FindGuardWebsite() {
  const [currentPage, setCurrentPage] = useState('home');

  const companies = [
    { id: 1, name: 'Metro Security Solutions', location: 'New York, NY', guards: 45 },
    { id: 2, name: 'Elite Guard Services', location: 'Los Angeles, CA', guards: 32 },
    { id: 3, name: 'SafeWatch Security', location: 'Chicago, IL', guards: 28 },
  ];

  const securities = [
    { id: 1, name: 'John Smith', specialty: 'Corporate', rating: 4.9, image: 'JS' },
    { id: 2, name: 'Maria Garcia', specialty: 'Event', rating: 4.8, image: 'MG' },
    { id: 3, name: 'David Chen', specialty: 'Residential', rating: 4.7, image: 'DC' },
    { id: 4, name: 'Sarah Johnson', specialty: 'Night Patrol', rating: 4.9, image: 'SJ' },
    { id: 5, name: 'Mike Brown', specialty: 'Retail', rating: 4.6, image: 'MB' },
    { id: 6, name: 'Lisa White', specialty: 'Corporate', rating: 4.8, image: 'LW' },
    { id: 7, name: 'James Wilson', specialty: 'Event', rating: 4.7, image: 'JW' },
    { id: 8, name: 'Anna Lee', specialty: 'Hospital', rating: 4.9, image: 'AL' },
    { id: 9, name: 'Tom Davis', specialty: 'Mall', rating: 4.5, image: 'TD' },
  ];

  const Header = () => (
    <header className="bg-blue-500 shadow-md h-[150px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
         <img src={logo} alt="Logo" className="h-[200px] w-[150px] "  />
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
            Companys
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

  const HomePage = () => (
    <div className="min-h-screen bg-gradient-to-b from-gray-200 to-blue-400">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-gray-500 h-64 rounded-lg mb-8"></div>
        
        <div className="bg-gray-300 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">About us</h2>
          <p className="text-gray-700 leading-relaxed">
            Providing the all guards company at one portal. Making the security management more easy and compact-able. We got all the contacts
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="bg-gray-500 h-32 rounded-lg"></div>
          <div className="bg-gray-300 h-32 rounded-lg"></div>
          <div className="bg-gray-500 h-32 rounded-lg"></div>
          <div className="bg-gray-300 h-32 rounded-lg"></div>
        </div>
      </main>
    </div>
  );

  const CompaniesPage = () => (
    <div className="min-h-screen bg-gradient-to-b from-gray-200 to-blue-400">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-gray-500 h-48 rounded-lg mb-12"></div>
        
        <h1 className="text-5xl font-bold text-center text-gray-800 mb-12">Companys</h1>
        
        <div className="space-y-6 max-w-4xl mx-auto">
          {companies.map((company) => (
            <div key={company.id} className="bg-gray-500 rounded-lg p-8 hover:bg-gray-600 transition-colors">
              <h3 className="text-2xl font-bold text-white mb-2">{company.name}</h3>
              <p className="text-gray-200 mb-1">{company.location}</p>
              <p className="text-gray-300 text-sm">{company.guards} Guards Available</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );

  const SecuritiesPage = () => (
    <div className="min-h-screen bg-gradient-to-b from-gray-200 to-blue-400">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-gray-500 h-48 rounded-lg mb-12"></div>
        
        <h1 className="text-5xl font-bold text-center text-gray-800 mb-12">Securities</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {securities.map((security) => (
            <div key={security.id} className="bg-gray-500 rounded-lg p-6 hover:bg-gray-600 transition-colors flex flex-col items-center">
              <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                {security.image}
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{security.name}</h3>
              <p className="text-gray-200 text-sm mb-2">{security.specialty} Security</p>
              <div className="flex items-center">
                <span className="text-yellow-400 mr-1">★</span>
                <span className="text-white font-medium">{security.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );

  return (
    <div>
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'companies' && <CompaniesPage />}
      {currentPage === 'securities' && <SecuritiesPage />}
    </div>
  );
}