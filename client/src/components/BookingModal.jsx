import React, { useState } from "react";
import { X, Calendar, Clock, CreditCard } from "lucide-react";

export default function BookingModal({ guard, onClose, companyName }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    startDate: "",
    durationType: "hours",
    duration: "",
    hours: "8",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    address: "",
    specialRequirements: "",
  });

  const [errors, setErrors] = useState({});
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validations
    if (name === "contactName" && value.length > 20) return;
    if (["contactPhone", "duration", "hours"].includes(name) && !/^\d*$/.test(value)) return;

    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear error on change
  };

  const usdToNpr = (usd) => Math.round(usd * 140);

  const calculateCost = () => {
    if (!formData.duration) return 0;
    let totalHours = 0;
    if (formData.durationType === "hours") totalHours = parseInt(formData.duration) || 0;
    if (formData.durationType === "days") totalHours = (parseInt(formData.duration) || 0) * (parseInt(formData.hours) || 8);
    if (formData.durationType === "months") totalHours = (parseInt(formData.duration) || 0) * 30 * (parseInt(formData.hours) || 8);
    return usdToNpr(totalHours * guard.hourlyRate);
  };

  // Validate current step inputs
  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.startDate) newErrors.startDate = "Start date is required";
      if (!formData.duration) newErrors.duration = "Duration is required";
    }
    if (step === 2) {
      if (!formData.contactName) newErrors.contactName = "Name is required";
      if (!formData.contactPhone) newErrors.contactPhone = "Phone is required";
      if (!formData.contactEmail) newErrors.contactEmail = "Email is required";
      if (!formData.address) newErrors.address = "Address is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setStep(step + 1);
  };

  const handlePrev = () => setStep(step - 1);

  const handleConfirmPayment = () => {
    if (!validateStep()) return;
    setBookingConfirmed(true);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Confirmation popup
  if (bookingConfirmed) {
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-xl max-w-md w-full p-8 text-center shadow-lg">
          <div className="w-20 h-20 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            Your security guard has been booked successfully. You will receive a confirmation email shortly.
          </p>
          <button
            onClick={onClose}
            className="bg-sky-500 text-white px-6 py-3 rounded-lg hover:bg-sky-600 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4 overflow-auto"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-lg w-full max-w-xl mx-auto overflow-hidden">
        {/* Header */}
        <div className="bg-sky-500 text-white p-5 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Book Security Guard</h2>
            {companyName && <p className="text-sky-100 text-sm mt-1">via {companyName}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-sky-600 rounded-full p-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent"
              />
              {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate}</p>}

              <label className="block text-sm font-medium text-gray-700">Duration Type</label>
              <select
                name="durationType"
                value={formData.durationType}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent"
              >
                <option value="hours">Hours</option>
                <option value="days">Days</option>
                <option value="months">Months</option>
              </select>

              <input
                type="text"
                name="duration"
                placeholder={`Number of ${formData.durationType}`}
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent"
              />
              {errors.duration && <p className="text-red-500 text-sm">{errors.duration}</p>}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-sky-500 text-white px-6 py-2 rounded-lg hover:bg-sky-600 transition-colors font-medium"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <input
                type="text"
                name="contactName"
                placeholder="Full Name"
                value={formData.contactName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent"
              />
              {errors.contactName && <p className="text-red-500 text-sm">{errors.contactName}</p>}

              <input
                type="tel"
                name="contactPhone"
                placeholder="Phone Number"
                value={formData.contactPhone}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent"
              />
              {errors.contactPhone && <p className="text-red-500 text-sm">{errors.contactPhone}</p>}

              <input
                type="email"
                name="contactEmail"
                placeholder="Email Address"
                value={formData.contactEmail}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent"
              />
              {errors.contactEmail && <p className="text-red-500 text-sm">{errors.contactEmail}</p>}

              <textarea
                name="address"
                placeholder="Service Address"
                rows="2"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent"
              />
              {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}

              <textarea
                name="specialRequirements"
                placeholder="Special Requirements (Optional)"
                rows="2"
                value={formData.specialRequirements}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent"
              />

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-6 py-2 border rounded-lg hover:bg-gray-100 transition-colors font-medium"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-sky-500 text-white px-6 py-2 rounded-lg hover:bg-sky-600 transition-colors font-medium"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Confirm */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-2">Review Booking</h3>
                <p><strong>Guard:</strong> {guard.name}</p>
                <p><strong>Start Date:</strong> {formData.startDate}</p>
                <p><strong>Duration:</strong> {formData.duration} {formData.durationType}</p>
                <p><strong>Contact:</strong> {formData.contactName}, {formData.contactPhone}</p>
                <p><strong>Address:</strong> {formData.address}</p>
                <p><strong>Special Requirements:</strong> {formData.specialRequirements || "-"}</p>
                <p className="mt-2 font-bold text-sky-600 text-lg">
                  Total Cost: Rs {calculateCost().toLocaleString()}
                </p>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-6 py-2 border rounded-lg hover:bg-gray-100 transition-colors font-medium"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  className="bg-sky-500 text-white px-6 py-2 rounded-lg hover:bg-sky-600 transition-colors font-medium flex items-center gap-2"
                >
                  <CreditCard className="w-4 h-4" /> Confirm Payment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
