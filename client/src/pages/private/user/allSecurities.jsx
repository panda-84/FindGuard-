// pages/private/user/allSecurities.jsx
// Loads real guards from API

import React, { useState, useEffect } from "react";
import { useApi } from "../../../hooks/useAPI";
import SecurityCard  from "../../../components/SecurityCard";
import BookingModal  from "../../../components/BookingModal";
import bgImage from "../../../assets/ads/guardsad.png";

export default function SecuritiesPage() {
  const { callApi } = useApi();
  const [guards,        setGuards]        = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [selectedGuard, setSelectedGuard] = useState(null);

  useEffect(() => { loadGuards(); }, []);

  const loadGuards = async () => {
    try {
      const res = await callApi("GET", "/guards");
      setGuards(res?.data?.data || []);
    } catch (err) {
      console.error("Load guards error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black">
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-gray-500 h-48 rounded-lg mb-12">
                    <img src={bgImage} alt="Company Header" className="w-full h-full object-cover rounded-lg" />
          
        </div>

        <h1 className="text-5xl font-bold text-center text-white mb-12">Securities</h1>

        {loading && (
          <p className="text-blue-300 text-center text-lg">Loading guards...</p>
        )}

        {!loading && guards.length === 0 && (
          <p className="text-blue-300 text-center text-lg">No guards available yet.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {guards.map((guard) => (
            <SecurityCard
              key={guard.id}
              security={guard}
              onClick={() => setSelectedGuard(guard)}
            />
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