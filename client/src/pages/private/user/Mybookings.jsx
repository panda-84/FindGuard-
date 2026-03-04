
import React, { useState, useEffect } from "react";
import { useApi } from "../../../hooks/useAPI";

export default function MyBookings() {
  const { callApi } = useApi();
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState("all");
  const [message,  setMessage]  = useState("");

  useEffect(() => { loadBookings(); }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await callApi("GET", "/profile/bookings");
      setBookings(res?.data?.data || []);
    } catch (err) {
      console.error("Load bookings error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cancel booking
  const handleCancel = async (id) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await callApi("DELETE", `/bookings/${id}`);
      setMessage("✅ Booking cancelled!");
      loadBookings();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("❌ " + err.message);
    }
  };

  const filtered = filter === "all"
    ? bookings
    : bookings.filter(b => b.status === filter);

  const statusStyle = (s) => {
    if (s === "confirmed") return "bg-green-400/20 text-green-400 border-green-400/30";
    if (s === "cancelled") return "bg-red-400/20 text-red-400 border-red-400/30";
    return "bg-yellow-400/20 text-yellow-400 border-yellow-400/30";
  };

  const counts = {
    all:       bookings.length,
    pending:   bookings.filter(b => b.status === "pending").length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    cancelled: bookings.filter(b => b.status === "cancelled").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black">
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-6">

        <h1 className="text-4xl font-bold text-white">My Bookings</h1>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {[
            { label: `All (${counts.all})`,             value: "all"       },
            { label: `Pending (${counts.pending})`,     value: "pending"   },
            { label: `Confirmed (${counts.confirmed})`, value: "confirmed" },
            { label: `Cancelled (${counts.cancelled})`, value: "cancelled" },
          ].map((f) => (
            <button key={f.value} onClick={() => setFilter(f.value)}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold capitalize transition ${
                filter === f.value
                  ? "bg-blue-700 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                  : "bg-blue-500/15 text-blue-300 hover:bg-blue-500/30"
              }`}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Message */}
        {message && (
          <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-3 text-center text-white">
            {message}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <p className="text-blue-300 text-center py-10">Loading bookings...</p>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-12 text-center
            border border-white/10">
            <p className="text-5xl mb-4">📋</p>
            <p className="text-white font-bold text-xl mb-2">No bookings found</p>
            <p className="text-blue-300 text-sm">
              {filter === "all"
                ? "You haven't made any bookings yet. Go to Securities page to book a guard!"
                : `No ${filter} bookings.`}
            </p>
          </div>
        )}

        {/* Bookings List */}
        <div className="space-y-4">
          {filtered.map((b) => (
            <div key={b.id}
              className="bg-white/5 backdrop-blur-md rounded-2xl p-5
                border border-white/10 hover:border-blue-400/30 transition
                shadow-[0_0_20px_rgba(168,85,248,0.1)]">

              <div className="flex flex-col md:flex-row md:items-start gap-4">

                {/* Guard Avatar */}
                <div className="w-14 h-14 bg-blue-700 rounded-full flex items-center
                  justify-center border-2 border-blue-400 flex-shrink-0">
                  <span className="text-white font-bold text-xl">
                    {b.guard?.name?.charAt(0) || "?"}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-white font-bold text-lg">{b.guard?.name || "Guard"}</p>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusStyle(b.status)}`}>
                      {b.status}
                    </span>
                  </div>

                  <p className="text-blue-300 text-sm">
                    🏢 {b.company?.name || "N/A"}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 mt-2">
                    <p className="text-blue-200 text-sm">
                      📅 <span className="text-white">{b.startDate?.slice(0,10)}</span>
                    </p>
                    <p className="text-blue-200 text-sm">
                      ⏱ <span className="text-white">{b.duration} {b.durationType}</span>
                    </p>
                    <p className="text-blue-200 text-sm">
                      📍 <span className="text-white">{b.address}</span>
                    </p>
                    <p className="text-blue-200 text-sm">
                      📞 <span className="text-white">{b.contactPhone}</span>
                    </p>
                    <p className="text-blue-200 text-sm">
                      📧 <span className="text-white">{b.contactEmail}</span>
                    </p>
                  </div>

                  <p className="text-green-300 font-bold text-lg mt-2">
                    Rs {Number(b.totalCost)?.toLocaleString()}
                  </p>

                  {b.specialRequirements && (
                    <p className="text-blue-300 text-sm">
                      📝 {b.specialRequirements}
                    </p>
                  )}
                </div>

                {/* Cancel button - only for pending */}
                {b.status === "pending" && (
                  <button
                    onClick={() => handleCancel(b.id)}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/40
                      text-red-400 border border-red-400/30
                      text-sm font-bold rounded-xl transition self-start"
                  >
                    ✕ Cancel
                  </button>
                )}

              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}