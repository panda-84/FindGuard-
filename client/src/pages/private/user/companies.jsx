// pages/private/user/companies.jsx
// Loads real companies + guards from API

import React, { useState, useEffect } from "react";
import { useApi } from "../../../hooks/useAPI";
import CompanyCard  from "../../../components/CompanyCard";
import GuardsList   from "../../../components/GuardsList";
import BookingModal from "../../../components/BookingModal";
import bgImage from "../../../assets/ads/companyAd.png";

export default function CompaniesPage() {
  const { callApi } = useApi();
  const [companies,       setCompanies]       = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedGuard,   setSelectedGuard]   = useState(null);
  const [guardsMap,       setGuardsMap]       = useState({});

  useEffect(() => { loadCompanies(); }, []);

  const loadCompanies = async () => {
    try {
      const res = await callApi("GET", "/companies");
      setCompanies(res?.data?.data || []);
    } catch (err) {
      console.error("Load companies error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load guards for a specific company when expanded
  const handleCompanyClick = async (company) => {
    if (selectedCompany?.id === company.id) {
      setSelectedCompany(null);
      return;
    }
    setSelectedCompany(company);

    // Load guards for this company if not already loaded
    if (!guardsMap[company.id]) {
      try {
        const res = await callApi("GET", `/guards?companyId=${company.id}`);
        setGuardsMap(prev => ({
          ...prev,
          [company.id]: res?.data?.data || [],
        }));
      } catch (err) {
        console.error("Load guards error:", err.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black">
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-gray-500 h-48 rounded-lg mb-12">
          <img src={bgImage} alt="Company Header" className="w-full h-full object-cover rounded-lg" />
        </div>

        <h1 className="text-5xl font-bold text-center text-white mb-12">Companies</h1>

        {loading && (
          <p className="text-blue-300 text-center text-lg">Loading companies...</p>
        )}

        {!loading && companies.length === 0 && (
          <p className="text-blue-300 text-center text-lg">No approved companies yet.</p>
        )}

        <div className="space-y-6 max-w-4xl mx-auto">
          {companies.map((company) => (
            <div key={company.id}>
              <CompanyCard
                company={company}
                isExpanded={selectedCompany?.id === company.id}
                onClick={() => handleCompanyClick(company)}
              />

              {selectedCompany?.id === company.id && (
                <GuardsList
                  guards={guardsMap[company.id] || []}
                  companyName={company.name}
                  onBook={(guard) => setSelectedGuard({ ...guard, company })}
                />
              )}
            </div>
          ))}
        </div>
      </main>

      {selectedGuard && (
        <BookingModal
          guard={selectedGuard}
          companyName={selectedGuard.company?.name}
          onClose={() => setSelectedGuard(null)}
        />
      )}
    </div>
  );
}