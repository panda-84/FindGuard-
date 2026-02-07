import React from 'react';

export default function SecurityCard({ security, onClick }) {
  return (
    <div 
      className="bg-gray-500 rounded-lg p-6 hover:bg-gray-600 transition-all cursor-pointer flex flex-col items-center transform hover:scale-105"
      onClick={onClick}
    >
      <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
        {security.image}
      </div>
      <h3 className="text-xl font-bold text-white mb-1">{security.name}</h3>
      <p className="text-gray-200 text-sm mb-2">{security.specialty} Security</p>
      <div className="flex items-center mb-2">
        <span className="text-yellow-400 mr-1">★</span>
        <span className="text-white font-medium">{security.rating}</span>
      </div>
      <p className="text-green-300 font-semibold">${security.hourlyRate}/hr</p>
    </div>
  );
}
