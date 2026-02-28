// components/SecurityCard.jsx

import React from "react";

export default function SecurityCard({ security, onClick }) {
  const companyName = security.company?.name || security.company || "";
  const price       = Number(security.hourlyRate || security.price || 0);

  return (
    <div
      className="bg-gradient-to-br from-blue-700 via-blue-900 to-indigo-900
        rounded-xl p-6 hover:scale-105 transform transition-all cursor-pointer
        shadow-lg flex flex-col items-center"
      onClick={onClick}
    >
      {/* Photo / Avatar */}
      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white
        shadow-md mb-4 bg-blue-500 flex items-center justify-center">
        {security.photo ? (
          <img src={security.photo} alt={security.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-white font-bold text-3xl">
            {security.name?.charAt(0)}
          </span>
        )}
      </div>

      <h3 className="text-xl font-semibold text-white mb-1">{security.name}</h3>
      <p className="text-blue-200 text-sm mb-2">{companyName}</p>
      <p className="text-blue-300 text-sm mb-2">
        {security.specialty || security.shift || "Security"}
      </p>

      <div className="flex items-center mb-2">
        <span className="text-yellow-400 mr-1">★</span>
        <span className="text-white font-medium">{security.rating || "5.0"}</span>
      </div>

      {/* NPR price */}
      <p className="text-green-300 font-semibold">
        Rs {price.toLocaleString()}/hr
      </p>
    </div>
  );
}