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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        {/* Banner */}
        <div className="h-32 sm:h-48 rounded-xl overflow-hidden mb-8 sm:mb-12">
          <img src={bgImage} alt="Guards Banner" className="w-full h-full object-cover" />
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-white mb-8 sm:mb-12">
          Securities
        </h1>

        {loading && (
          <p className="text-blue-300 text-center text-base sm:text-lg">Loading guards...</p>
        )}

        {!loading && guards.length === 0 && (
          <p className="text-blue-300 text-center text-base sm:text-lg">No guards available yet.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
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