import React from 'react';
import securityImage from '../../assets/ads/ad1.png'; // Make sure to have an image at this path

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black">
      <main className="max-w-7xl mx-auto px-6 py-12">
<div className="h-64 rounded-lg mb-8 overflow-hidden">
  <img 
    src={securityImage}
    alt="Security Company" 
    className="w-full h-full object-cover"
  />
</div>
        
        <div className="bg-gray-300 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">About us</h2>
          <p className="text-gray-700 leading-relaxed">
            Providing all guard companies at one portal. Making security management more easy and compatible. 
            We have all the contacts you need for professional security services.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="bg-gray-500 h-32 rounded-lg"></div>
          <div className="bg-gray-300 h-32 rounded-lg"></div>
          <div className="bg-gray-500 h-32 rounded-lg"></div>
          <div className="bg-gray-300 h-32 rounded-lg"></div>
        </div>
      </main>
    </div>
  );
}
