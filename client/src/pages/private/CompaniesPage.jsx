import React, { useState } from 'react';
import { companies } from '../../data/securityData';
import CompanyCard from '../../components/CompanyCard';
import GuardsList from '../../components/GuardsList';

export default function CompaniesPage() {
  const [selectedCompany, setSelectedCompany] = useState(null);

  const handleCompanyClick = (company) => {
    setSelectedCompany(selectedCompany?.id === company.id ? null : company);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-200 to-blue-400">
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-gray-500 h-48 rounded-lg mb-12"></div>
        
        <h1 className="text-5xl font-bold text-center text-gray-800 mb-12">Companies</h1>
        
        <div className="space-y-6 max-w-4xl mx-auto">
          {companies.map((company) => (
            <div key={company.id}>
              <CompanyCard 
                company={company} 
                isExpanded={selectedCompany?.id === company.id}
                onClick={() => handleCompanyClick(company)}
              />
              
              {selectedCompany?.id === company.id && (
                <GuardsList guards={company.availableGuards} companyName={company.name} />
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
