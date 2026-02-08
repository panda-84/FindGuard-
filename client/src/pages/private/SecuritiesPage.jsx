import React, { useState } from 'react';
import { allSecurities } from '../../data/securityData';
import SecurityCard from '../../components/SecurityCard';
import BookingModal from '../../components/BookingModal';

export default function SecuritiesPage() {
  const [selectedGuard, setSelectedGuard] = useState(null);

  const handleGuardClick = (guard) => {
    setSelectedGuard(guard);
  };

  const handleCloseModal = () => {
    setSelectedGuard(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black">
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-gray-500 h-48 rounded-lg mb-12"></div>
        
        <h1 className="text-5xl font-bold text-center text-white mb-12">Securities</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {allSecurities.map((security) => (
            <SecurityCard 
              key={security.id}
              security={security}
              onClick={() => handleGuardClick(security)}
            />
          ))}
        </div>
      </main>

      {selectedGuard && (
        <BookingModal 
          guard={selectedGuard}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
