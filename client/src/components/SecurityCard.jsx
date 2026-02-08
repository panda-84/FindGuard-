import React from "react";

export default function SecurityCard({ security, onClick }) {
  return (
    <div
      className="bg-gradient-to-br from-blue-700 via-blue-900 to-indigo-900 rounded-xl p-6 hover:scale-105 transform transition-all cursor-pointer shadow-lg flex flex-col items-center"
      onClick={onClick}
    >
      {/* Security Photo / Avatar */}
      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-md mb-4">
        <img
          src={security.photo} // Pass the image URL in security.photo
          alt={security.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Security Name */}
      <h3 className="text-xl font-semibold text-white mb-1">{security.name}</h3>

      {/* Company Name */}
      <p className="text-blue-200 text-sm mb-2">{security.company}</p>

      {/* Specialty */}
      <p className="text-blue-300 text-sm mb-2">{security.specialty} Security</p>

      {/* Rating */}
      <div className="flex items-center mb-2">
        <span className="text-yellow-400 mr-1">★</span>
        <span className="text-white font-medium">{security.rating}</span>
      </div>

      {/* Hourly Rate */}
      <p className="text-green-300 font-semibold">${security.hourlyRate}/hr</p>
    </div>
  );
}
