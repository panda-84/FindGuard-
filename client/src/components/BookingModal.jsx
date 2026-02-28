// components/BookingModal.jsx
// Connected to real API

import React, { useState } from "react";
import { X, CreditCard } from "lucide-react";
import { useApi } from "../hooks/useAPI";

export default function BookingModal({ guard, onClose, companyName }) {
  const { callApi } = useApi();
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

  const [errors,           setErrors]           = useState({});
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [loading,          setLoading]          = useState(false);
  const [apiError,         setApiError]         = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "contactName" && value.length > 50) return;
    if (["contactPhone", "duration", "hours"].includes(name) && !/^\d*$/.test(value)) return;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const usdToNpr = (usd) => Math.round(usd * 140);

  const calculateCost = () => {
    if (!formData.duration) return 0;
    const hourlyRate = guard.hourlyRate || guard.price || 0;
    let totalHours = 0;
    if (formData.durationType === "hours")  totalHours = parseInt(formData.duration) || 0;
    if (formData.durationType === "days")   totalHours = (parseInt(formData.duration) || 0) * (parseInt(formData.hours) || 8);
    if (formData.durationType === "months") totalHours = (parseInt(formData.duration) || 0) * 30 * (parseInt(formData.hours) || 8);
    return usdToNpr(totalHours * hourlyRate);
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.startDate) newErrors.startDate = "Start date is required";
      if (!formData.duration)  newErrors.duration  = "Duration is required";
    }
    if (step === 2) {
      if (!formData.contactName)  newErrors.contactName  = "Name is required";
      if (!formData.contactPhone) newErrors.contactPhone = "Phone is required";
      if (!formData.contactEmail) newErrors.contactEmail = "Email is required";
      if (!formData.address)      newErrors.address      = "Address is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => { if (validateStep()) setStep(step + 1); };
  const handlePrev = () => setStep(step - 1);

  // ── SUBMIT TO API ──────────────────────────────
  const handleConfirmPayment = async () => {
    if (!validateStep()) return;

    setLoading(true);
    setApiError("");

    try {
      await callApi("POST", "/bookings", {
        data: {
          guardId:            guard.id,
          startDate:          formData.startDate,
          duration:           parseInt(formData.duration),
          durationType:       formData.durationType,
          contactName:        formData.contactName,
          contactPhone:       formData.contactPhone,
          contactEmail:       formData.contactEmail,
          address:            formData.address,
          specialRequirements: formData.specialRequirements,
        },
      });

      setBookingConfirmed(true);

    } catch (err) {
      setApiError(err.message || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // ── CONFIRMED ──
  if (bookingConfirmed) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        onClick={handleBackdropClick}>
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center shadow-xl">
          <div className="w-20 h-20 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed! 🎉</h2>
          <p className="text-gray-600 mb-2">
            <strong>{guard.name}</strong> has been booked successfully!
          </p>
          <p className="text-gray-500 text-sm mb-6">
            The company will confirm your booking soon.
            You'll be notified when it's approved.
          </p>
          <button onClick={onClose}
            className="bg-sky-500 text-white px-8 py-3 rounded-xl hover:bg-sky-600 transition font-bold">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-auto"
      onClick={handleBackdropClick}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl mx-auto overflow-hidden"
        onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="bg-sky-500 text-white p-5 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Book Security Guard</h2>
            <p className="text-sky-100 text-sm mt-1">
              {guard.name} {companyName ? `· ${companyName}` : ""}
            </p>
          </div>
          <button onClick={onClose}
            className="text-white hover:bg-sky-600 rounded-full p-2 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex border-b">
          {["Schedule", "Contact", "Review"].map((label, i) => (
            <div key={label} className={`flex-1 py-3 text-center text-sm font-semibold transition ${
              step === i + 1
                ? "text-sky-600 border-b-2 border-sky-500"
                : step > i + 1
                ? "text-green-600"
                : "text-gray-400"
            }`}>
              {step > i + 1 ? "✓ " : ""}{label}
            </div>
          ))}
        </div>

        {/* API Error */}
        {apiError && (
          <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
            ❌ {apiError}
          </div>
        )}

        <div className="p-6 space-y-4">

          {/* STEP 1 - Schedule */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date *</label>
                <input type="date" name="startDate"
                  value={formData.startDate} onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-400 outline-none" />
                {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Duration Type *</label>
                <select name="durationType" value={formData.durationType} onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-400 outline-none">
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                  <option value="months">Months</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Number of {formData.durationType} *
                </label>
                <input type="text" name="duration" placeholder={`e.g. 8`}
                  value={formData.duration} onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-400 outline-none" />
                {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
              </div>

              {/* Live cost preview */}
              {formData.duration && (
                <div className="bg-sky-50 rounded-lg p-3 border border-sky-200">
                  <p className="text-sky-700 font-semibold">
                    Estimated Cost: Rs {calculateCost().toLocaleString()}
                  </p>
                  <p className="text-sky-500 text-xs">
                    Rate: ${guard.hourlyRate || guard.price}/hr × 140 NPR
                  </p>
                </div>
              )}

              <div className="flex justify-end">
                <button onClick={handleNext}
                  className="bg-sky-500 text-white px-6 py-2 rounded-lg hover:bg-sky-600 transition font-semibold">
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 - Contact */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
                <input type="text" name="contactName" placeholder="Your full name"
                  value={formData.contactName} onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-400 outline-none" />
                {errors.contactName && <p className="text-red-500 text-xs mt-1">{errors.contactName}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number *</label>
                <input type="tel" name="contactPhone" placeholder="98XXXXXXXX"
                  value={formData.contactPhone} onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-400 outline-none" />
                {errors.contactPhone && <p className="text-red-500 text-xs mt-1">{errors.contactPhone}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address *</label>
                <input type="email" name="contactEmail" placeholder="your@email.com"
                  value={formData.contactEmail} onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-400 outline-none" />
                {errors.contactEmail && <p className="text-red-500 text-xs mt-1">{errors.contactEmail}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Service Address *</label>
                <textarea name="address" placeholder="Where do you need the guard?" rows={2}
                  value={formData.address} onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-400 outline-none resize-none" />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Special Requirements</label>
                <textarea name="specialRequirements" placeholder="Any special instructions... (optional)" rows={2}
                  value={formData.specialRequirements} onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-400 outline-none resize-none" />
              </div>

              <div className="flex justify-between">
                <button onClick={handlePrev}
                  className="px-6 py-2 border rounded-lg hover:bg-gray-100 transition font-semibold">
                  ← Back
                </button>
                <button onClick={handleNext}
                  className="bg-sky-500 text-white px-6 py-2 rounded-lg hover:bg-sky-600 transition font-semibold">
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 - Review */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-2">
                <h3 className="font-bold text-gray-700 mb-3">📋 Booking Summary</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p className="text-gray-500">Guard</p>
                  <p className="font-semibold">{guard.name}</p>
                  <p className="text-gray-500">Start Date</p>
                  <p className="font-semibold">{formData.startDate}</p>
                  <p className="text-gray-500">Duration</p>
                  <p className="font-semibold">{formData.duration} {formData.durationType}</p>
                  <p className="text-gray-500">Contact</p>
                  <p className="font-semibold">{formData.contactName}</p>
                  <p className="text-gray-500">Phone</p>
                  <p className="font-semibold">{formData.contactPhone}</p>
                  <p className="text-gray-500">Address</p>
                  <p className="font-semibold">{formData.address}</p>
                  {formData.specialRequirements && (
                    <>
                      <p className="text-gray-500">Special Req.</p>
                      <p className="font-semibold">{formData.specialRequirements}</p>
                    </>
                  )}
                </div>

                <div className="border-t pt-3 mt-3">
                  <p className="text-sky-600 font-bold text-xl">
                    Total: Rs {calculateCost().toLocaleString()}
                  </p>
                  <p className="text-gray-400 text-xs">Status will be pending until company confirms</p>
                </div>
              </div>

              <div className="flex justify-between">
                <button onClick={handlePrev}
                  className="px-6 py-2 border rounded-lg hover:bg-gray-100 transition font-semibold">
                  ← Back
                </button>
                <button onClick={handleConfirmPayment} disabled={loading}
                  className="bg-sky-500 text-white px-6 py-2 rounded-lg hover:bg-sky-600
                    transition font-semibold flex items-center gap-2 disabled:opacity-50">
                  <CreditCard className="w-4 h-4" />
                  {loading ? "Booking..." : "Confirm Booking"}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}