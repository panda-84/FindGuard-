import React, { useState } from 'react';
import { X, Calendar, Clock, DollarSign, User } from 'lucide-react';

export default function BookingModal({ guard, onClose, companyName }) {
  const [formData, setFormData] = useState({
    startDate: '',
    durationType: 'hours',
    duration: '',
    hours: '8',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    address: '',
    specialRequirements: '',
  });

  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const calculateCost = () => {
    if (!formData.duration) return 0;
    
    let totalHours = 0;
    if (formData.durationType === 'hours') {
      totalHours = parseInt(formData.duration) || 0;
    } else if (formData.durationType === 'days') {
      totalHours = (parseInt(formData.duration) || 0) * (parseInt(formData.hours) || 8);
    } else if (formData.durationType === 'months') {
      totalHours = (parseInt(formData.duration) || 0) * 30 * (parseInt(formData.hours) || 8);
    }
    
    return totalHours * guard.hourlyRate;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setBookingConfirmed(true);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (bookingConfirmed) {
    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-lg max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            Your security guard has been booked successfully. You will receive a confirmation email shortly.
          </p>
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg max-w-2xl w-full my-8">
        <div className="bg-blue-500 text-white p-6 rounded-t-lg flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Book Security Guard</h2>
            {companyName && <p className="text-blue-100 text-sm mt-1">via {companyName}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-600 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Guard Info */}
          <div className="bg-gray-100 rounded-lg p-4 mb-6 flex items-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
              {guard.image}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800">{guard.name}</h3>
              <p className="text-gray-600">{guard.specialty} Security</p>
              <div className="flex items-center mt-1">
                <span className="text-yellow-500 mr-1">★</span>
                <span className="text-gray-700 font-medium">{guard.rating}</span>
                <span className="mx-2 text-gray-400">|</span>
                <span className="text-green-600 font-semibold">${guard.hourlyRate}/hr</span>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Duration Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Duration Type
                </label>
                <select
                  name="durationType"
                  value={formData.durationType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                  <option value="months">Months</option>
                </select>
              </div>

              {/* Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of {formData.durationType}
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    min="1"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {formData.durationType !== 'hours' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hours per day
                    </label>
                    <input
                      type="number"
                      name="hours"
                      value={formData.hours}
                      onChange={handleChange}
                      min="1"
                      max="24"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold text-gray-800 mb-3">Contact Information</h3>
                
                <div className="space-y-3">
                  <input
                    type="text"
                    name="contactName"
                    placeholder="Full Name"
                    value={formData.contactName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  
                  <input
                    type="tel"
                    name="contactPhone"
                    placeholder="Phone Number"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  
                  <input
                    type="email"
                    name="contactEmail"
                    placeholder="Email Address"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  
                  <textarea
                    name="address"
                    placeholder="Service Address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Special Requirements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Requirements (Optional)
                </label>
                <textarea
                  name="specialRequirements"
                  value={formData.specialRequirements}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Any specific requirements or instructions..."
                />
              </div>

              {/* Cost Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Estimated Total Cost:
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    ${calculateCost().toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
