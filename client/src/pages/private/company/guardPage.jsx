// guardPage.jsx
// Company can add, edit, delete, suspend guards

import React, { useState, useEffect } from "react";
import { useApi } from "../../../hooks/useAPI";

export default function GuardPage() {
  const { callApi } = useApi();
  const [guards,   setGuards]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editGuard, setEditGuard] = useState(null);
  const [message,  setMessage]  = useState("");

  // Form state
  const [form, setForm] = useState({
    name: "", badge: "", phone: "", experience: "",
    shift: "Day", zone: "", price: "",
  });

  useEffect(() => { loadGuards(); }, []);

  const loadGuards = async () => {
    try {
      const res = await callApi("GET", "/guards/mine");
      setGuards(res?.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Open form for adding new guard
  const handleAdd = () => {
    setForm({ name: "", badge: "", phone: "", experience: "", shift: "Day", zone: "", price: "" });
    setEditGuard(null);
    setShowForm(true);
  };

  // Open form for editing existing guard
  const handleEdit = (guard) => {
    setForm({
      name: guard.name, badge: guard.badge || "",
      phone: guard.phone || "", experience: guard.experience || "",
      shift: guard.shift || "Day", zone: guard.zone || "",
      price: guard.price || "",
    });
    setEditGuard(guard);
    setShowForm(true);
  };

  // Submit add or edit
  const handleSubmit = async () => {
    try {
      if (editGuard) {
        await callApi("PUT", `/guards/${editGuard.id}`, { data: form });
        setMessage("Guard updated!");
      } else {
        await callApi("POST", "/guards", { data: form });
        setMessage("Guard added!");
      }
      setShowForm(false);
      loadGuards();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err.message);
    }
  };

  // Delete guard
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this guard?")) return;
    try {
      await callApi("DELETE", `/guards/${id}`);
      setMessage("Guard deleted!");
      loadGuards();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err.message);
    }
  };

  // Suspend or reinstate
  const handleStatus = async (id, status) => {
    try {
      await callApi("PATCH", `/guards/${id}/status`, { data: { status } });
      setMessage(`Guard ${status}!`);
      loadGuards();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err.message);
    }
  };

  const inputClass = "w-full px-3 py-2 rounded-lg bg-blue-500/15 text-white border-none outline-none hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition";

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">My Guards</h1>
        <button
          onClick={handleAdd}
          className="px-5 py-2 bg-blue-700 hover:bg-blue-500 text-white font-bold
            rounded-3xl transition hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]"
        >
          + Add Guard
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-3 text-center text-white">
          {message}
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-black/20 backdrop-blur-md rounded-3xl p-6
          shadow-[0_0_30px_rgba(168,85,248,0.25)] border border-blue-500/20">

          <h2 className="text-lg font-bold text-white mb-4">
            {editGuard ? "Edit Guard" : "Add New Guard"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-blue-300 text-xs font-bold mb-1 block">Name *</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Guard name" className={inputClass} />
            </div>
            <div>
              <label className="text-blue-300 text-xs font-bold mb-1 block">Badge</label>
              <input name="badge" value={form.badge} onChange={handleChange} placeholder="Badge number" className={inputClass} />
            </div>
            <div>
              <label className="text-blue-300 text-xs font-bold mb-1 block">Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone number" className={inputClass} />
            </div>
            <div>
              <label className="text-blue-300 text-xs font-bold mb-1 block">Experience</label>
              <input name="experience" value={form.experience} onChange={handleChange} placeholder="e.g. 5 years" className={inputClass} />
            </div>
            <div>
              <label className="text-blue-300 text-xs font-bold mb-1 block">Shift</label>
              <select name="shift" value={form.shift} onChange={handleChange} className={inputClass}>
                <option value="Day">Day</option>
                <option value="Night">Night</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>
            <div>
              <label className="text-blue-300 text-xs font-bold mb-1 block">Zone</label>
              <input name="zone" value={form.zone} onChange={handleChange} placeholder="e.g. Zone A" className={inputClass} />
            </div>
            <div>
              <label className="text-blue-300 text-xs font-bold mb-1 block">Price ($/hr) *</label>
              <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Hourly rate" className={inputClass} />
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-700 hover:bg-blue-500 text-white font-bold
                rounded-3xl transition hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]"
            >
              {editGuard ? "Update" : "Add Guard"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-3xl transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Guards List */}
      {loading && <p className="text-blue-300 text-center">Loading guards...</p>}

      {!loading && guards.length === 0 && (
        <div className="bg-black/20 backdrop-blur-md rounded-3xl p-10 text-center
          shadow-[0_0_30px_rgba(168,85,248,0.25)]">
          <p className="text-blue-300">No guards yet. Add your first guard!</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {guards.map((guard) => (
          <div key={guard.id}
            className="bg-gradient-to-br from-blue-700 via-blue-900 to-indigo-900
              rounded-xl p-5 shadow-lg
              hover:scale-[1.02] transform transition-all
              hover:shadow-[0_0_25px_rgba(168,85,248,0.4)]">

            {/* Avatar */}
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center
              mx-auto mb-3 border-2 border-white shadow-md">
              <span className="text-white font-bold text-2xl">
                {guard.name?.charAt(0)}
              </span>
            </div>

            <h3 className="text-white font-bold text-center text-lg">{guard.name}</h3>
            <p className="text-blue-200 text-sm text-center">Badge: {guard.badge || "N/A"}</p>
            <p className="text-blue-300 text-sm text-center">{guard.shift} · {guard.zone || "N/A"}</p>

            <div className="flex justify-between mt-3">
              <span className="text-yellow-400 text-sm">★ {guard.rating}</span>
              <span className="text-green-300 font-semibold text-sm">${guard.price}/hr</span>
            </div>

            {/* Status badge */}
            <div className="flex justify-center mt-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                guard.status === "available"  ? "bg-green-400/20 text-green-400" :
                guard.status === "suspended"  ? "bg-red-400/20 text-red-400" :
                "bg-yellow-400/20 text-yellow-400"
              }`}>
                {guard.status}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleEdit(guard)}
                className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-400 text-white
                  text-xs font-bold rounded-lg transition"
              >
                ✏️ Edit
              </button>

              {guard.status === "suspended" ? (
                <button
                  onClick={() => handleStatus(guard.id, "available")}
                  className="flex-1 py-1.5 bg-green-600 hover:bg-green-400 text-white
                    text-xs font-bold rounded-lg transition"
                >
                  ✅ Reinstate
                </button>
              ) : (
                <button
                  onClick={() => handleStatus(guard.id, "suspended")}
                  className="flex-1 py-1.5 bg-yellow-600 hover:bg-yellow-400 text-white
                    text-xs font-bold rounded-lg transition"
                >
                  ⏸ Suspend
                </button>
              )}

              <button
                onClick={() => handleDelete(guard.id)}
                className="flex-1 py-1.5 bg-red-600 hover:bg-red-400 text-white
                  text-xs font-bold rounded-lg transition"
              >
                🗑 Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}