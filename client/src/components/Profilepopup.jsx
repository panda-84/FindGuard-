// ProfilePopup.jsx
// Separate profile popup component
// All fields editable + photo upload from computer

import React, { useState, useRef } from "react";

export default function ProfilePopup({ onClose }) {
  // User data state
  const [name,  setName]  = useState("John Doe");
  const [phone, setPhone] = useState("9800000000");
  const [dob,   setDob]   = useState("2000-01-01");
  const [photo, setPhoto] = useState(null); // stores uploaded photo

  // Edit mode for each field
  const [editName,  setEditName]  = useState(false);
  const [editPhone, setEditPhone] = useState(false);
  const [editDob,   setEditDob]   = useState(false);

  // Temp values while editing
  const [tempName,  setTempName]  = useState("John Doe");
  const [tempPhone, setTempPhone] = useState("9800000000");
  const [tempDob,   setTempDob]   = useState("2000-01-01");

  // Ref to hidden file input
  const fileInputRef = useRef(null);

  // Mock user - not editable
  const email = "customer@test.com";
  const role  = "Customer";

  // Handle photo upload from computer
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Convert file to URL so we can show it
    const imageUrl = URL.createObjectURL(file);
    setPhoto(imageUrl);
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  return (
    <>
      {/* Dark overlay - click to close */}
      <div
        className="fixed inset-0 bg-black/60 z-40"
        onClick={onClose}
      />

      {/* Popup Card */}
      <div className="fixed top-[170px] right-6 z-50 w-[320px] md:w-[400px]
        bg-black/80 backdrop-blur-md rounded-3xl p-6
        shadow-[0_0_40px_rgba(168,85,248,0.5)]
        border border-blue-500/30
        max-h-[80vh] overflow-y-auto">

        {/* Title + Close */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-bold text-lg">My Profile</h2>
          <button
            onClick={onClose}
            className="text-blue-300 hover:text-white text-xl transition"
          >
            ✕
          </button>
        </div>

        {/* ── PHOTO UPLOAD ── */}
        <div className="flex flex-col items-center mb-6">
          {/* Photo circle */}
          <div
            className="w-24 h-24 rounded-full border-2 border-blue-400
              shadow-[0_0_20px_rgba(168,85,247,0.5)]
              overflow-hidden cursor-pointer relative
              hover:shadow-[0_0_30px_rgba(168,85,247,0.8)]
              transition duration-300"
            onClick={() => fileInputRef.current.click()}
          >
            {photo ? (
              // Show uploaded photo
              <img
                src={photo}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              // Show initial letter if no photo
              <div className="w-full h-full bg-blue-700 flex items-center justify-center">
                <span className="text-white font-bold text-3xl">
                  {name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            {/* Camera icon overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition">
              <span className="text-white text-2xl">📷</span>
            </div>
          </div>

          {/* Hidden file input */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handlePhotoUpload}
            className="hidden"
          />

          <p className="text-blue-300 text-xs mt-2">Click photo to change</p>
        </div>

        {/* ── FIELDS ── */}
        <div className="space-y-3">

          {/* Name - editable */}
          <div className="bg-blue-500/15 rounded-xl px-4 py-3
            hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition">
            <p className="text-blue-300 text-xs font-bold mb-1">Full Name</p>
            {editName ? (
              <div className="flex items-center gap-2">
                <input
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="flex-1 bg-transparent text-white outline-none
                    border-b border-blue-400 pb-1"
                  autoFocus
                />
                <button
                  onClick={() => { setName(tempName); setEditName(false); }}
                  className="text-green-400 hover:text-green-300 font-bold text-sm transition"
                >
                  Save
                </button>
                <button
                  onClick={() => { setEditName(false); setTempName(name); }}
                  className="text-red-400 hover:text-red-300 font-bold text-sm transition"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-white font-semibold">{name}</p>
                <button
                  onClick={() => { setEditName(true); setTempName(name); }}
                  className="text-blue-400 hover:text-blue-200 text-xs transition"
                >
                  ✏️ Edit
                </button>
              </div>
            )}
          </div>

          {/* Email - NOT editable */}
          <div className="bg-blue-500/10 rounded-xl px-4 py-3 opacity-75">
            <p className="text-blue-300 text-xs font-bold mb-1">Email (cannot edit)</p>
            <p className="text-white font-semibold">{email}</p>
          </div>

          {/* Phone - editable */}
          <div className="bg-blue-500/15 rounded-xl px-4 py-3
            hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition">
            <p className="text-blue-300 text-xs font-bold mb-1">Phone</p>
            {editPhone ? (
              <div className="flex items-center gap-2">
                <input
                  value={tempPhone}
                  onChange={(e) => setTempPhone(e.target.value)}
                  className="flex-1 bg-transparent text-white outline-none
                    border-b border-blue-400 pb-1"
                  autoFocus
                />
                <button
                  onClick={() => { setPhone(tempPhone); setEditPhone(false); }}
                  className="text-green-400 hover:text-green-300 font-bold text-sm transition"
                >
                  Save
                </button>
                <button
                  onClick={() => { setEditPhone(false); setTempPhone(phone); }}
                  className="text-red-400 hover:text-red-300 font-bold text-sm transition"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-white font-semibold">{phone}</p>
                <button
                  onClick={() => { setEditPhone(true); setTempPhone(phone); }}
                  className="text-blue-400 hover:text-blue-200 text-xs transition"
                >
                  ✏️ Edit
                </button>
              </div>
            )}
          </div>

          {/* Date of Birth - editable */}
          <div className="bg-blue-500/15 rounded-xl px-4 py-3
            hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition">
            <p className="text-blue-300 text-xs font-bold mb-1">Date of Birth</p>
            {editDob ? (
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={tempDob}
                  onChange={(e) => setTempDob(e.target.value)}
                  className="flex-1 bg-transparent text-white outline-none
                    border-b border-blue-400 pb-1"
                  autoFocus
                />
                <button
                  onClick={() => { setDob(tempDob); setEditDob(false); }}
                  className="text-green-400 hover:text-green-300 font-bold text-sm transition"
                >
                  Save
                </button>
                <button
                  onClick={() => { setEditDob(false); setTempDob(dob); }}
                  className="text-red-400 hover:text-red-300 font-bold text-sm transition"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-white font-semibold">{dob}</p>
                <button
                  onClick={() => { setEditDob(true); setTempDob(dob); }}
                  className="text-blue-400 hover:text-blue-200 text-xs transition"
                >
                  ✏️ Edit
                </button>
              </div>
            )}
          </div>

          {/* Role - not editable */}
          <div className="bg-blue-500/10 rounded-xl px-4 py-3 opacity-75">
            <p className="text-blue-300 text-xs font-bold mb-1">Role</p>
            <p className="text-white font-semibold">{role}</p>
          </div>

        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full mt-5 bg-red-500/20 hover:bg-red-500/40
            text-red-400 border border-red-400/30
            font-bold py-2 rounded-3xl
            transition duration-300
            hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]"
        >
          Logout
        </button>

      </div>
    </>
  );
}