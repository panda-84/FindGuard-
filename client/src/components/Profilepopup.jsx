import React, { useState, useRef, useEffect } from "react";
import { useApi } from "../hooks/useAPI";

export default function ProfilePopup({ onClose }) {
  const { callApi } = useApi();

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [message, setMessage] = useState("");
  const [photo,   setPhoto]   = useState(null);

  const [name,  setName]  = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob,   setDob]   = useState("");
  const [role,  setRole]  = useState("");

  const [tempName,  setTempName]  = useState("");
  const [tempPhone, setTempPhone] = useState("");
  const [tempDob,   setTempDob]   = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res  = await callApi("GET", "/profile");
      const user = res?.data?.data;
      if (user) {
        setName(user.name   || "");
        setEmail(user.email || "");
        setPhone(user.phone || "");
        setDob(user.dob     || "");
        setRole(user.role   || "");
        localStorage.setItem("userName", user.name || "");
      }
    } catch (err) {
      console.error("Load profile error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(URL.createObjectURL(file));
  };

  const handleEdit = () => {
    setTempName(name);
    setTempPhone(phone);
    setTempDob(dob);
    setEditing(true);
  };

  // ── SAVE TO API ──
  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res     = await callApi("PUT", "/profile", {
        data: { name: tempName, phone: tempPhone, dob: tempDob },
      });
      const updated = res?.data?.data;
      if (updated) {
        setName(updated.name   || tempName);
        setPhone(updated.phone || tempPhone);
        setDob(updated.dob     || tempDob);
        localStorage.setItem("userName", updated.name || tempName);
      }
      setMessage("✅ Profile updated!");
      setEditing(false);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => { setEditing(false); setMessage(""); };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    window.location.href = "/login";
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div
          className="w-full max-w-[420px] bg-black/80 backdrop-blur-md rounded-3xl p-6
            shadow-[0_0_40px_rgba(168,85,248,0.5)] border border-blue-500/30
            max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >

          {/* Title + Buttons */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-bold text-lg">My Profile</h2>
            <div className="flex items-center gap-3">
              {editing ? (
                <>
                  <button onClick={handleSave} disabled={saving}
                    className="text-sm font-bold px-4 py-1.5 rounded-lg
                      bg-blue-700 hover:bg-blue-500 text-white transition disabled:opacity-50">
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button onClick={handleCancel}
                    className="text-sm font-bold px-4 py-1.5 rounded-lg
                      bg-gray-600 hover:bg-gray-500 text-white transition">
                    Cancel
                  </button>
                </>
              ) : (
                <button onClick={handleEdit}
                  className="text-sm font-bold px-4 py-1.5 rounded-lg
                    bg-blue-700 hover:bg-blue-500 text-white transition
                    hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                  ✏️ Edit
                </button>
              )}
              <button onClick={onClose} className="text-blue-300 hover:text-white text-xl transition">✕</button>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className="mb-4 bg-blue-500/20 border border-blue-400/30
              rounded-xl p-2 text-center text-white text-sm">
              {message}
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="text-center py-10">
              <p className="text-blue-300 animate-pulse">Loading profile...</p>
            </div>
          ) : (
            <>
              {/* PHOTO + NAME */}
              <div className="flex flex-col items-center mb-6">
                <div
                  className="w-24 h-24 rounded-full border-2 border-blue-400
                    shadow-[0_0_20px_rgba(168,85,247,0.5)] overflow-hidden
                    cursor-pointer relative hover:shadow-[0_0_30px_rgba(168,85,247,0.8)] transition"
                  onClick={() => fileInputRef.current.click()}
                >
                  {photo ? (
                    <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-blue-700 flex items-center justify-center">
                      <span className="text-white font-bold text-3xl">
                        {name.charAt(0).toUpperCase() || "?"}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                    <span className="text-white text-2xl">📷</span>
                  </div>
                </div>

                <input type="file" accept="image/*" ref={fileInputRef}
                  onChange={handlePhotoUpload} className="hidden" />

                <p className="text-white font-bold text-lg mt-3">{name || "—"}</p>
                <p className="text-blue-300 text-xs capitalize">{role}</p>
                <p className="text-blue-400 text-xs mt-1">Click photo to change</p>
              </div>

              {/* FIELDS */}
              <div className="space-y-3">

                <div className="bg-blue-500/15 rounded-xl px-4 py-3">
                  <p className="text-blue-300 text-xs font-bold mb-1">Full Name</p>
                  {editing ? (
                    <input value={tempName} onChange={(e) => setTempName(e.target.value)}
                      className="w-full bg-transparent text-white outline-none border-b border-blue-400 pb-1" />
                  ) : (
                    <p className="text-white font-semibold">{name || "—"}</p>
                  )}
                </div>

                <div className="bg-blue-500/10 rounded-xl px-4 py-3 opacity-70">
                  <p className="text-blue-300 text-xs font-bold mb-1">Email (cannot edit)</p>
                  <p className="text-white font-semibold">{email || "—"}</p>
                </div>

                <div className="bg-blue-500/15 rounded-xl px-4 py-3">
                  <p className="text-blue-300 text-xs font-bold mb-1">Phone</p>
                  {editing ? (
                    <input value={tempPhone} onChange={(e) => setTempPhone(e.target.value)}
                      className="w-full bg-transparent text-white outline-none border-b border-blue-400 pb-1" />
                  ) : (
                    <p className="text-white font-semibold">{phone || "—"}</p>
                  )}
                </div>

                <div className="bg-blue-500/15 rounded-xl px-4 py-3">
                  <p className="text-blue-300 text-xs font-bold mb-1">Date of Birth</p>
                  {editing ? (
                    <input type="date" value={tempDob} onChange={(e) => setTempDob(e.target.value)}
                      className="w-full bg-transparent text-white outline-none border-b border-blue-400 pb-1" />
                  ) : (
                    <p className="text-white font-semibold">{dob || "—"}</p>
                  )}
                </div>

              </div>

              {/* Logout */}
              <button onClick={handleLogout}
                className="w-full mt-5 bg-red-500/20 hover:bg-red-500/40
                  text-red-400 border border-red-400/30 font-bold py-2 rounded-3xl
                  transition hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                Logout
              </button>
            </>
          )}

        </div>
      </div>
    </>
  );
}