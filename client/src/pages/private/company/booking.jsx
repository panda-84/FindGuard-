
import React, { useState, useEffect } from "react";
import { useApi } from "../../../hooks/useAPI";

export default function BookingPage() {
  const { callApi } = useApi();
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [message,  setMessage]  = useState("");
  const [filter,   setFilter]   = useState("all");

  useEffect(() => { loadBookings(); }, []);

  const loadBookings = async () => {
    try {
      const res = await callApi("GET", "/bookings/company");
      setBookings(res?.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Confirm or cancel a booking
  const handleStatus = async (id, status) => {
    try {
      await callApi("PATCH", `/bookings/${id}`, { data: { status } });
      setMessage(`Booking ${status}!`);
      loadBookings();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err.message);
    }
  };

  // Filter bookings
  const filtered = filter === "all"
    ? bookings
    : bookings.filter(b => b.status === filter);

  const statusStyle = (s) => {
    if (s === "confirmed") return "bg-green-400/20 text-green-400 border-green-400/30";
    if (s === "cancelled") return "bg-red-400/20 text-red-400 border-red-400/30";
    return "bg-yellow-400/20 text-yellow-400 border-yellow-400/30";
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Bookings</h1>

        {/* Filter buttons */}
        <div className="flex gap-2 flex-wrap">
          {["all", "pending", "confirmed", "cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold capitalize transition ${
                filter === f
                  ? "bg-blue-700 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                  : "bg-blue-500/15 text-blue-300 hover:bg-blue-500/30"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-3 text-center text-white">
          {message}
        </div>
      )}

      {/* Loading */}
      {loading && <p className="text-blue-300 text-center">Loading bookings...</p>}

      {/* No bookings */}
      {!loading && filtered.length === 0 && (
        <div className="bg-black/20 backdrop-blur-md rounded-3xl p-10 text-center
          shadow-[0_0_30px_rgba(168,85,248,0.25)]">
          <p className="text-blue-300">No bookings found.</p>
        </div>
      )}

      {/* Bookings List */}
      <div className="space-y-4">
        {filtered.map((booking) => (
          <div key={booking.id}
            className="bg-black/20 backdrop-blur-md rounded-2xl p-5
              shadow-[0_0_20px_rgba(168,85,248,0.2)] border border-blue-500/20
              hover:border-blue-400/40 transition">

            <div className="flex flex-col md:flex-row md:items-center gap-4">

              {/* Booking Info */}
              <div className="flex-1 space-y-1">
                <p className="text-white font-bold text-lg">{booking.contactName}</p>
                <p className="text-blue-300 text-sm">
                  🛡 Guard: <span className="text-white">{booking.guard?.name || "N/A"}</span>
                </p>
                <p className="text-blue-300 text-sm">
                  📅 Date: <span className="text-white">{booking.startDate?.slice(0,10)}</span>
                </p>
                <p className="text-blue-300 text-sm">
                  ⏱ Duration: <span className="text-white">{booking.duration} {booking.durationType}</span>
                </p>
                <p className="text-blue-300 text-sm">
                  📍 Address: <span className="text-white">{booking.address}</span>
                </p>
                <p className="text-blue-300 text-sm">
                  📞 Phone: <span className="text-white">{booking.contactPhone}</span>
                </p>
                <p className="text-green-300 font-semibold">
                  Rs {Number(booking.totalCost)?.toLocaleString()}
                </p>
              </div>

              {/* Status + Actions */}
              <div className="flex flex-col items-end gap-3">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusStyle(booking.status)}`}>
                  {booking.status}
                </span>

                {/* Only show buttons for pending */}
                {booking.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatus(booking.id, "confirmed")}
                      className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white
                        text-sm font-bold rounded-lg transition"
                    >
                      ✅ Confirm
                    </button>
                    <button
                      onClick={() => handleStatus(booking.id, "cancelled")}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white
                        text-sm font-bold rounded-lg transition"
                    >
                      ✕ Cancel
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}