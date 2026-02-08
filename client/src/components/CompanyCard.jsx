import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function CompanyCard({ company, isExpanded, onClick }) {
  return (
    <div
      className="bg-gradient-to-r from-blue-700 via-blue-900 to-indigo-900 rounded-xl p-6 shadow-lg hover:scale-105 transform transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start">
        {/* Company Logo */}
        <div className="w-16 h-16 mr-4 flex-shrink-0">
          <img
            src={company.logo} // Pass the logo URL in company.logo
            alt={`${company.name} Logo`}
            className="w-full h-full object-cover rounded-full border-2 border-white shadow-md"
          />
        </div>

        {/* Company Info */}
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-1">{company.name}</h3>
          <p className="text-blue-200 text-sm mb-1">{company.location}</p>
          <p className="text-blue-300 text-sm mb-2">{company.guards} Guards Available</p>
          <p className="text-blue-100 text-sm">{company.description}</p>
        </div>

        {/* Modern Expand/Collapse Button */}
        <div
          className="ml-3 mt-1 p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-40 transition-all"
        >
          {isExpanded ? (
            <ChevronUp className="text-white w-5 h-5" />
          ) : (
            <ChevronDown className="text-white w-5 h-5" />
          )}
        </div>
      </div>
    </div>
  );
}
