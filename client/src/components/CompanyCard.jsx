import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function CompanyCard({ company, isExpanded, onClick }) {
  return (
    <div 
      className="bg-gray-500 rounded-lg p-8 hover:bg-gray-600 transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-white mb-2">{company.name}</h3>
          <p className="text-gray-200 mb-1">{company.location}</p>
          <p className="text-gray-300 text-sm mb-3">{company.guards} Guards Available</p>
          <p className="text-gray-200 text-sm">{company.description}</p>
        </div>
        <div className="ml-4">
          {isExpanded ? (
            <ChevronUp className="text-white w-6 h-6" />
          ) : (
            <ChevronDown className="text-white w-6 h-6" />
          )}
        </div>
      </div>
    </div>
  );
}
