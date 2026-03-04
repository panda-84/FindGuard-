

import React, { useState } from "react";
import { X, CreditCard } from "lucide-react";
import { useApi } from "../hooks/useAPI";

const NPR_PER_HOUR = 800; 

const calculateCost = (guard, duration, durationType, hoursPerDay) => {
  if (!duration) return { totalHours: 0, totalNPR: 0, rateNPR: 0 };

  const rawPrice  = parseFloat(guard.hourlyRate || guard.price || 0);
  const rateNPR   = rawPrice < 100 ? Math.round(rawPrice * 133) : Math.round(rawPrice);

  const dur = parseInt(duration) || 0;
  const hrs = parseInt(hoursPerDay) || 8;

  let totalHours = 0;
  if (durationType === "hours")  totalHours = dur;
  if (durationType === "days")   totalHours = dur * hrs;
  if (durationType === "months") totalHours = dur * 30 * hrs;

  const totalNPR = Math.round(totalHours * rateNPR);
  return { totalHours, totalNPR, rateNPR };
};

export default function BookingModal({ guard, onClose, companyName }) {
  const { callApi } = useApi();

  const [step,             setStep]             = useState(1);
  const [loading,          setLoading]          = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [apiError,         setApiError]         = useState("");
  const [errors,           setErrors]           = useState({});

  const [formData, setFormData] = useState({
    startDate:           "",
    durationType:        "hours",
    duration:            "",
    hoursPerDay:         "8",
    contactName:         "",
    contactPhone:        "",
    contactEmail:        "",
    address:             "",
    specialRequirements: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["duration", "hoursPerDay"].includes(name) && !/^\d*$/.test(value)) return;
    if (name === "contactPhone" && !/^\d*$/.test(value)) return;
    if (name === "contactPhone" && value.length > 10) return;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handlePhoneKey = (e) => {
    if (
      !/[0-9]/.test(e.key) &&
      !["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight"].includes(e.key)
    ) {
      e.preventDefault();
    }
  };

  const { totalHours, totalNPR, rateNPR } = calculateCost(
    guard,
    formData.duration,
    formData.durationType,
    formData.hoursPerDay,
  );

  const validateStep1 = () => {
    const e = {};
    if (!formData.startDate)    e.startDate    = "Start date is required";
    if (!formData.duration)     e.duration     = "Duration is required";
    if (!formData.contactName)  e.contactName  = "Name is required";
    if (!formData.contactPhone) e.contactPhone = "Phone is required";
    else if (!/^[0-9]{10}$/.test(formData.contactPhone)) e.contactPhone = "Phone must be exactly 10 digits";
    if (!formData.contactEmail) e.contactEmail = "Email is required";
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.contactEmail)) e.contactEmail = "Enter a valid email (e.g. name@gmail.com)";
    if (!formData.address)      e.address      = "Address is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validateStep1()) setStep(2); };

  const handleConfirm = async () => {
    setLoading(true);
    setApiError("");
    try {
      await callApi("POST", "/bookings", {
        data: {
          guardId:             guard.id,
          startDate:           formData.startDate,
          duration:            parseInt(formData.duration),
          durationType:        formData.durationType,
          contactName:         formData.contactName,
          contactPhone:        formData.contactPhone,
          contactEmail:        formData.contactEmail,
          address:             formData.address,
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

  const inp = "w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none text-sm";
  const lbl = "block text-sm font-semibold text-gray-700 mb-1";
  const err = "text-red-500 text-xs mt-1";

  // ── CONFIRMED SCREEN ──
  if (bookingConfirmed) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        onClick={handleBackdropClick}>
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center shadow-xl">
          <div className="w-20 h-20 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Submitted! 🎉</h2>
          <p className="text-gray-600 mb-1">
            <strong>{guard.name}</strong> has been requested.
          </p>
          <p className="text-sky-600 font-bold text-lg mb-1">
            Rs {totalNPR.toLocaleString()}
          </p>
          <p className="text-gray-400 text-sm mb-6">
            Company will confirm your booking soon.
          </p>
          <button onClick={onClose}
            className="bg-sky-500 text-white px-8 py-3 rounded-xl hover:bg-sky-600 transition font-bold">
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-auto"
      onClick={handleBackdropClick}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-auto overflow-hidden"
        onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="bg-sky-500 text-white px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">Book Security Guard</h2>
            <p className="text-sky-100 text-sm">
              {guard.name}{companyName ? ` · ${companyName}` : ""}
            </p>
          </div>
          <button onClick={onClose} className="hover:bg-sky-600 rounded-full p-2 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2 Step indicator */}
        <div className="flex border-b">
          {["Details", "Review & Confirm"].map((label, i) => (
            <div key={label}
              className={`flex-1 py-3 text-center text-sm font-semibold transition ${
                step === i + 1
                  ? "text-sky-600 border-b-2 border-sky-500"
                  : step > i + 1
                  ? "text-green-600"
                  : "text-gray-400"
              }`}>
              {step > i + 1 ? "✓ " : `${i + 1}. `}{label}
            </div>
          ))}
        </div>

        {apiError && (
          <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
            ❌ {apiError}
          </div>
        )}

        <div className="p-6 max-h-[75vh] overflow-y-auto">

          {/* ── STEP 1: All Details ── */}
          {step === 1 && (
            <div className="space-y-4">

              {/* Guard Info Card */}
              <div className="bg-sky-50 rounded-xl p-4 border border-sky-100 flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xl">{guard.name?.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-bold text-gray-800">{guard.name}</p>
                  <p className="text-sky-600 text-sm font-semibold">
                    Rs {rateNPR.toLocaleString()}/hr
                  </p>
                </div>
              </div>

              {/* SCHEDULE SECTION */}
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">📅 Schedule</p>

              <div>
                <label className={lbl}>Start Date *</label>
                <input type="date" name="startDate"
                  value={formData.startDate} onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className={inp} />
                {errors.startDate && <p className={err}>{errors.startDate}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>Duration Type *</label>
                  <select name="durationType" value={formData.durationType}
                    onChange={handleChange} className={inp}>
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                    <option value="months">Months</option>
                  </select>
                </div>
                <div>
                  <label className={lbl}>How Many? *</label>
                  <input type="text" name="duration"
                    placeholder={`e.g. ${formData.durationType === "hours" ? "8" : formData.durationType === "days" ? "7" : "1"}`}
                    value={formData.duration} onChange={handleChange} className={inp} />
                  {errors.duration && <p className={err}>{errors.duration}</p>}
                </div>
              </div>

              {/* Hours per day selector - only for days/months */}
              {(formData.durationType === "days" || formData.durationType === "months") && (
                <div>
                  <label className={lbl}>Hours per Day</label>
                  <select name="hoursPerDay" value={formData.hoursPerDay}
                    onChange={handleChange} className={inp}>
                    {[4, 6, 8, 10, 12, 16, 24].map(h => (
                      <option key={h} value={h}>{h} hours/day</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Live cost preview */}
              {formData.duration > 0 && (
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-green-800 font-black text-xl">
                        Rs {totalNPR.toLocaleString()}
                      </p>
                      <p className="text-green-600 text-xs mt-0.5">
                        {totalHours} hrs × Rs {rateNPR.toLocaleString()}/hr
                      </p>
                    </div>
                    <div className="text-right text-xs text-gray-400">
                      <p className="font-semibold">{formData.duration} {formData.durationType}</p>
                      {formData.durationType !== "hours" && (
                        <p>{formData.hoursPerDay} hrs/day</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* CONTACT SECTION */}
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest pt-2">👤 Contact Info</p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>Full Name *</label>
                  <input type="text" name="contactName" placeholder="Your name"
                    value={formData.contactName} onChange={handleChange} className={inp} />
                  {errors.contactName && <p className={err}>{errors.contactName}</p>}
                </div>
                <div>
                  <label className={lbl}>Phone * <span className="text-gray-400 font-normal text-xs">(10 digits)</span></label>
                  <input
                    type="tel"
                    name="contactPhone"
                    placeholder="98XXXXXXXX"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    onKeyDown={handlePhoneKey}
                    maxLength={10}
                    className={inp}
                  />
                  <div className="flex justify-between mt-1">
                    {errors.contactPhone
                      ? <p className={err}>{errors.contactPhone}</p>
                      : <span />
                    }
                    <p className="text-gray-400 text-xs ml-auto">{formData.contactPhone.length}/10</p>
                  </div>
                </div>
              </div>

              <div>
                <label className={lbl}>Email * <span className="text-gray-400 font-normal text-xs">(name@example.com)</span></label>
                <input type="email" name="contactEmail" placeholder="your@email.com"
                  maxLength={50}
                  value={formData.contactEmail} onChange={handleChange} className={inp} />
                {errors.contactEmail && <p className={err}>{errors.contactEmail}</p>}
              </div>

              <div>
                <label className={lbl}>Service Address *</label>
                <textarea name="address" placeholder="Where do you need the guard?"
                  rows={2} value={formData.address} onChange={handleChange}
                  className={inp + " resize-none"} />
                {errors.address && <p className={err}>{errors.address}</p>}
              </div>

              <div>
                <label className={lbl}>
                  Special Requirements
                  <span className="text-gray-400 font-normal ml-1">(optional)</span>
                </label>
                <textarea name="specialRequirements"
                  placeholder="Any special instructions..."
                  rows={2} value={formData.specialRequirements} onChange={handleChange}
                  className={inp + " resize-none"} />
              </div>

              <button onClick={handleNext}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white
                  font-bold py-3 rounded-xl transition mt-2">
                Review Booking →
              </button>
            </div>
          )}

          {/* ── STEP 2: Review + Confirm ── */}
          {step === 2 && (
            <div className="space-y-4">

              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 space-y-3">
                <h3 className="font-bold text-gray-800 text-base">📋 Booking Summary</h3>

                {/* Guard info */}
                <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                  <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{guard.name?.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{guard.name}</p>
                    <p className="text-gray-500 text-sm">{companyName}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <p className="text-gray-500">Start Date</p>
                  <p className="font-semibold text-right">{formData.startDate}</p>

                  <p className="text-gray-500">Duration</p>
                  <p className="font-semibold text-right">
                    {formData.duration} {formData.durationType}
                    {formData.durationType !== "hours" && ` (${formData.hoursPerDay}hrs/day)`}
                  </p>

                  <p className="text-gray-500">Total Hours</p>
                  <p className="font-semibold text-right">{totalHours} hrs</p>

                  <p className="text-gray-500">Hourly Rate</p>
                  <p className="font-semibold text-right">Rs {rateNPR.toLocaleString()}/hr</p>

                  <p className="text-gray-500">Contact</p>
                  <p className="font-semibold text-right">{formData.contactName}</p>

                  <p className="text-gray-500">Phone</p>
                  <p className="font-semibold text-right">{formData.contactPhone}</p>

                  <p className="text-gray-500">Email</p>
                  <p className="font-semibold text-right text-xs">{formData.contactEmail}</p>

                  <p className="text-gray-500">Address</p>
                  <p className="font-semibold text-right text-xs">{formData.address}</p>

                  {formData.specialRequirements && (
                    <>
                      <p className="text-gray-500">Special Req.</p>
                      <p className="font-semibold text-right text-xs">{formData.specialRequirements}</p>
                    </>
                  )}
                </div>

                {/* Total cost */}
                <div className="bg-sky-50 rounded-xl p-4 border border-sky-200 mt-2">
                  <p className="text-gray-500 text-sm mb-1">Total Cost</p>
                  <p className="text-sky-700 font-black text-3xl">
                    Rs {totalNPR.toLocaleString()}
                  </p>
                  <p className="text-sky-500 text-xs mt-1">
                    {totalHours} hrs × Rs {rateNPR.toLocaleString()}/hr
                  </p>
                </div>

                <p className="text-gray-400 text-xs text-center">
                  ⏳ Booking will be <strong>pending</strong> until company confirms
                </p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => { setStep(1); setApiError(""); }}
                  className="flex-1 py-3 border border-gray-300 rounded-xl
                    hover:bg-gray-50 transition font-semibold text-gray-600">
                  ← Edit
                </button>
                <button onClick={handleConfirm} disabled={loading}
                  className="flex-1 py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold
                    rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50">
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