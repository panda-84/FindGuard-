// ProfilePopup.jsx
// One edit button top right
// All fields editable at once
// Popup in center of screen

import React, { useState, useRef } from "react";

export default function ProfilePopup({ onClose }) {
  const savedName = localStorage.getItem("userName") || "User";

  const [editing, setEditing] = useState(false);

  const [name,  setName]  = useState(savedName);
  const [phone, setPhone] = useState("9800000000");
  const [dob,   setDob]   = useState("2000-01-01");
  const [photo, setPhoto] = useState(null);

  // Temp values while editing
  const [tempName,  setTempName]  = useState(savedName);
  const [tempPhone, setTempPhone] = useState("9800000000");
  const [tempDob,   setTempDob]   = useState("2000-01-01");

  const fileInputRef = useRef(null);

  const email = "customer@test.com";
  const role  = "Customer";

  // Handle photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(URL.createObjectURL(file));
  };

  // Start editing - copy current values to temp
  const handleEdit = () => {
    setTempName(name);
    setTempPhone(phone);
    setTempDob(dob);
    setEditing(true);
  };

  // Save all fields at once
  const handleSave = () => {
    setName(tempName);
    setPhone(tempPhone);
    setDob(tempDob);
    localStorage.setItem("userName", tempName);
    setEditing(false);
  };

  // Cancel editing
  const handleCancel = () => {
    setEditing(false);
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    window.location.href = "/login";
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-40"
        onClick={onClose}
      />

      {/* Popup - centered on screen */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="w-full max-w-[420px]
          bg-black/80 backdrop-blur-md rounded-3xl p-6
          shadow-[0_0_40px_rgba(168,85,248,0.5)]
          border border-blue-500/30
          max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >

          {/* Title + Edit + Close buttons */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-bold text-lg">My Profile</h2>

            <div className="flex items-center gap-3">
              {/* Edit / Save / Cancel button */}
              {editing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="text-sm font-bold px-4 py-1.5 rounded-lg
                      bg-blue-700 hover:bg-blue-500 text-white transition
                      hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="text-sm font-bold px-4 py-1.5 rounded-lg
                      bg-gray-600 hover:bg-gray-500 text-white transition"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEdit}
                  className="text-sm font-bold px-4 py-1.5 rounded-lg
                    bg-blue-700 hover:bg-blue-500 text-white transition
                    hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                >
                  ✏️ Edit
                </button>
              )}

              {/* Close button */}
              <button
                onClick={onClose}
                className="text-blue-300 hover:text-white text-xl transition"
              >
                ✕
              </button>
            </div>
          </div>

          {/* ── PHOTO + NAME ── */}
          <div className="flex flex-col items-center mb-6">

            {/* Photo */}
            <div
              className="w-24 h-24 rounded-full border-2 border-blue-400
                shadow-[0_0_20px_rgba(168,85,247,0.5)]
                overflow-hidden cursor-pointer relative
                hover:shadow-[0_0_30px_rgba(168,85,247,0.8)]
                transition duration-300"
              onClick={() => fileInputRef.current.click()}
            >
              {photo ? (
                <img src={photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-blue-700 flex items-center justify-center">
                  <span className="text-white font-bold text-3xl">
                    {name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              {/* Camera hover */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                <span className="text-white text-2xl">📷</span>
              </div>
            </div>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              className="hidden"
            />

            <p className="text-white font-bold text-lg mt-3">{name}</p>
            <p className="text-blue-300 text-xs">{role}</p>
            <p className="text-blue-400 text-xs mt-1">Click photo to change</p>
          </div>

          {/* ── FIELDS ── */}
          <div className="space-y-3">

            {/* Name */}
            <div className="bg-blue-500/15 rounded-xl px-4 py-3">
              <p className="text-blue-300 text-xs font-bold mb-1">Full Name</p>
              {editing ? (
                <input
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full bg-transparent text-white outline-none
                    border-b border-blue-400 pb-1"
                />
              ) : (
                <p className="text-white font-semibold">{name}</p>
              )}
            </div>

            {/* Email - never editable */}
            <div className="bg-blue-500/10 rounded-xl px-4 py-3 opacity-70">
              <p className="text-blue-300 text-xs font-bold mb-1">Email (cannot edit)</p>
              <p className="text-white font-semibold">{email}</p>
            </div>

            {/* Phone */}
            <div className="bg-blue-500/15 rounded-xl px-4 py-3">
              <p className="text-blue-300 text-xs font-bold mb-1">Phone</p>
              {editing ? (
                <input
                  value={tempPhone}
                  onChange={(e) => setTempPhone(e.target.value)}
                  className="w-full bg-transparent text-white outline-none
                    border-b border-blue-400 pb-1"
                />
              ) : (
                <p className="text-white font-semibold">{phone}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div className="bg-blue-500/15 rounded-xl px-4 py-3">
              <p className="text-blue-300 text-xs font-bold mb-1">Date of Birth</p>
              {editing ? (
                <input
                  type="date"
                  value={tempDob}
                  onChange={(e) => setTempDob(e.target.value)}
                  className="w-full bg-transparent text-white outline-none
                    border-b border-blue-400 pb-1"
                />
              ) : (
                <p className="text-white font-semibold">{dob}</p>
              )}
            </div>

          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full mt-5 bg-red-500/20 hover:bg-red-500/40
              text-red-400 border border-red-400/30
              font-bold py-2 rounded-3xl transition duration-300
              hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]"
          >
            Logout
          </button>

        </div>
      </div>
    </>
  );
}