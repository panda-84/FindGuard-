import React, { useState } from 'react';
import SecurityCard from './SecurityCard';
import BookingModal from './BookingModal';

export default function GuardsList({ guards, companyName }) {
  const [selectedGuard, setSelectedGuard] = useState(null);

  const handleGuardClick = (guard) => {
    setSelectedGuard(guard);
  };

  const handleCloseModal = () => {
    setSelectedGuard(null);
  };

  return (
    <>
      <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Available Guards from {companyName}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {guards.map((guard) => (
            <SecurityCard 
              key={guard.id}
              security={guard}
              onClick={() => handleGuardClick(guard)}
            />
          ))}
        </div>
      </div>

      {selectedGuard && (
        <BookingModal 
          guard={selectedGuard}
          onClose={handleCloseModal}
          companyName={companyName}
        />
      )}
    </>
  );
}
