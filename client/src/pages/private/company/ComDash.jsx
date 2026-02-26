import { useState } from "react";

// ─────────────────────────────────────────────
// MOCK DATA  (easy to swap with API calls)
// ─────────────────────────────────────────────
const MOCK_GUARDS = [
  { id: 1, name: "Marcus Webb",    badge: "GD-001", phone: "+1-555-0101", experience: "5 yrs", shift: "Day",   zone: "Zone A", price: 25, status: "available", rating: 4.8 },
  { id: 2, name: "Sarah Okonkwo", badge: "GD-002", phone: "+1-555-0102", experience: "7 yrs", shift: "Night", zone: "Zone B", price: 30, status: "on-duty",   rating: 4.9 },
  { id: 3, name: "James Tran",    badge: "GD-003", phone: "+1-555-0103", experience: "3 yrs", shift: "Day",   zone: "Zone C", price: 20, status: "available", rating: 4.6 },
  { id: 4, name: "Priya Nair",    badge: "GD-004", phone: "+1-555-0104", experience: "2 yrs", shift: "—",     zone: "—",      price: 18, status: "suspended", rating: 3.9 },
  { id: 5, name: "Carlos Mendez", badge: "GD-005", phone: "+1-555-0105", experience: "6 yrs", shift: "Day",   zone: "Zone A", price: 28, status: "on-duty",   rating: 4.7 },
  { id: 6, name: "Aisha Farouq",  badge: "GD-006", phone: "+1-555-0106", experience: "4 yrs", shift: "Night", zone: "Zone D", price: 22, status: "available", rating: 4.5 },
];

const MOCK_BOOKINGS = [
  { id: "BK-101", client: "Apex Mall",       guard: "Marcus Webb",   date: "2026-03-01", time: "08:00–20:00", location: "Downtown", status: "pending"   },
  { id: "BK-102", client: "Harbor Warehouse", guard: "Sarah Okonkwo", date: "2026-03-02", time: "20:00–08:00", location: "Eastside",  status: "confirmed" },
  { id: "BK-103", client: "City Bank HQ",    guard: "Carlos Mendez", date: "2026-03-03", time: "09:00–17:00", location: "Midtown",   status: "pending"   },
  { id: "BK-104", client: "Luxe Hotel",      guard: "Aisha Farouq",  date: "2026-03-04", time: "18:00–06:00", location: "Uptown",    status: "confirmed" },
  { id: "BK-105", client: "Tech Campus",     guard: "James Tran",    date: "2026-03-05", time: "07:00–19:00", location: "Westpark",  status: "cancelled" },
];

// ─────────────────────────────────────────────
// EMPTY GUARD FORM TEMPLATE
// ─────────────────────────────────────────────
const emptyGuard = { name: "", badge: "", phone: "", experience: "", shift: "Day", zone: "Zone A", price: "", status: "available", rating: 5.0 };

// ─────────────────────────────────────────────
// SMALL REUSABLE COMPONENTS
// ─────────────────────────────────────────────

// Status badge
const StatusBadge = ({ status }) => {
  const styles = {
    available: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    "on-duty":  "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    suspended:  "bg-red-500/20 text-red-400 border border-red-500/30",
    pending:    "bg-amber-500/20 text-amber-400 border border-amber-500/30",
    confirmed:  "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    cancelled:  "bg-slate-500/20 text-slate-400 border border-slate-500/30",
  };
  return (
    <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${styles[status] || styles.cancelled}`}>
      {status}
    </span>
  );
};

// Avatar circle with initials
const Avatar = ({ name, size = "w-10 h-10", textSize = "text-sm" }) => {
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const colors = ["bg-amber-500", "bg-blue-500", "bg-emerald-500", "bg-purple-500", "bg-pink-500", "bg-cyan-500"];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div className={`${size} ${color} rounded-full flex items-center justify-center font-bold text-white ${textSize} flex-shrink-0`}>
      {initials}
    </div>
  );
};

// Form input — easy to edit, all in one place
const Field = ({ label, value, onChange, type = "text", placeholder, options, required }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
      {label}{required && <span className="text-amber-400 ml-1">*</span>}
    </label>
    {options ? (
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-amber-500 transition-colors"
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    ) : (
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 text-sm placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
      />
    )}
  </div>
);

// Stat summary card for dashboard
const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex items-center gap-4 flex-1 min-w-36">
    <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-xl flex-shrink-0`}>{icon}</div>
    <div>
      <p className="text-xs text-slate-500 uppercase font-semibold tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-black text-slate-100">{value}</p>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// PAGE: DASHBOARD
// ─────────────────────────────────────────────
const Dashboard = ({ guards, bookings }) => {
  const stats = [
    { label: "Total Guards",      value: guards.length,                                          icon: "🛡️", color: "bg-blue-500/20"    },
    { label: "Available",         value: guards.filter(g => g.status === "available").length,    icon: "✅",  color: "bg-emerald-500/20" },
    { label: "On Duty",           value: guards.filter(g => g.status === "on-duty").length,      icon: "⚡",  color: "bg-amber-500/20"   },
    { label: "Suspended",         value: guards.filter(g => g.status === "suspended").length,    icon: "🚫",  color: "bg-red-500/20"     },
    { label: "Pending Bookings",  value: bookings.filter(b => b.status === "pending").length,    icon: "📋",  color: "bg-purple-500/20"  },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-100">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Live overview of your security operations.</p>
      </div>

      {/* Stats */}
      <div className="flex gap-4 flex-wrap">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Recent Bookings */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700">
          <h2 className="font-bold text-slate-200">Recent Bookings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 text-xs uppercase tracking-widest border-b border-slate-700">
                {["ID", "Client", "Guard", "Date", "Status"].map(h => (
                  <th key={h} className="text-left px-6 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-3 text-amber-400 font-bold">{b.id}</td>
                  <td className="px-6 py-3 text-slate-200">{b.client}</td>
                  <td className="px-6 py-3 text-slate-400">{b.guard}</td>
                  <td className="px-6 py-3 text-slate-400">{b.date}</td>
                  <td className="px-6 py-3"><StatusBadge status={b.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Available Guards Quick View */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h2 className="font-bold text-slate-200 mb-4">Available Guards</h2>
        <div className="flex flex-wrap gap-3">
          {guards.filter(g => g.status === "available").map(g => (
            <div key={g.id} className="flex items-center gap-3 bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2.5">
              <Avatar name={g.name} size="w-8 h-8" textSize="text-xs" />
              <div>
                <p className="text-slate-200 font-semibold text-sm">{g.name}</p>
                <p className="text-slate-500 text-xs">{g.shift} · {g.zone} · <span className="text-amber-400">${g.price}/hr</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// PAGE: GUARDS LIST
// ─────────────────────────────────────────────
const GuardsList = ({ guards, setGuards, setPage, setActiveGuard }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = guards.filter(g => {
    const q = search.toLowerCase();
    const matchSearch = g.name.toLowerCase().includes(q) || g.badge.toLowerCase().includes(q);
    const matchFilter = filter === "all" || g.status === filter;
    return matchSearch && matchFilter;
  });

  const toggleSuspend = (id) => {
    setGuards(prev => prev.map(g =>
      g.id === id
        ? { ...g, status: g.status === "suspended" ? "available" : "suspended", zone: g.status === "suspended" ? "Zone A" : "—", shift: g.status === "suspended" ? "Day" : "—" }
        : g
    ));
  };

  const openDetail = (guard) => { setActiveGuard(guard); setPage("guard-detail"); };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-100">Guards</h1>
          <p className="text-slate-500 text-sm mt-1">{guards.length} guards registered</p>
        </div>
        <button
          onClick={() => setPage("add-guard")}
          className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-5 py-2.5 rounded-lg text-sm transition-colors"
        >
          + Add Guard
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search name or badge…"
          className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 text-sm placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors flex-1 min-w-52"
        />
        {["all", "available", "on-duty", "suspended"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2.5 rounded-lg font-semibold text-sm capitalize transition-colors border ${
              filter === f
                ? "bg-amber-500 text-black border-amber-500"
                : "bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500"
            }`}
          >
            {f === "all" ? "All" : f}
          </button>
        ))}
      </div>

      {/* Guard Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(g => (
          <div key={g.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col gap-4 hover:border-slate-500 transition-colors">
            {/* Guard header */}
            <div className="flex items-center gap-3">
              <Avatar name={g.name} />
              <div className="flex-1 min-w-0">
                <p className="text-slate-100 font-bold truncate">{g.name}</p>
                <p className="text-slate-500 text-xs">{g.badge}</p>
              </div>
              <StatusBadge status={g.status} />
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-2">
              {[
                ["Shift",      g.shift],
                ["Zone",       g.zone],
                ["Experience", g.experience],
                ["Rating",     `★ ${g.rating}`],
                ["Price",      `$${g.price}/hr`],
                ["Phone",      g.phone],
              ].map(([k, v]) => (
                <div key={k} className="bg-slate-700/50 rounded-lg px-3 py-2">
                  <p className="text-slate-500 text-xs uppercase font-semibold tracking-widest">{k}</p>
                  <p className="text-slate-200 text-sm font-semibold mt-0.5 truncate">{v}</p>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => openDetail(g)}
                className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 rounded-lg py-2 font-semibold text-sm transition-colors"
              >
                View / Edit
              </button>
              <button
                onClick={() => toggleSuspend(g.id)}
                className={`flex-1 rounded-lg py-2 font-semibold text-sm transition-colors border ${
                  g.status === "suspended"
                    ? "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border-emerald-500/30"
                    : "bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30"
                }`}
              >
                {g.status === "suspended" ? "Reinstate" : "Suspend"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// PAGE: ADD GUARD
// ─────────────────────────────────────────────
const AddGuard = ({ setGuards, setPage }) => {
  const [form, setForm] = useState({ ...emptyGuard });
  const [saved, setSaved] = useState(false);

  // Helper to update a single field
  const set = key => val => setForm(p => ({ ...p, [key]: val }));

  const handleSubmit = () => {
    if (!form.name || !form.badge || !form.phone) return alert("Please fill in Name, Badge and Phone.");
    setGuards(prev => [...prev, { ...form, id: Date.now(), price: Number(form.price) || 0, rating: 5.0 }]);
    setSaved(true);
    setTimeout(() => { setSaved(false); setPage("guards"); }, 1400);
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <button onClick={() => setPage("guards")} className="text-slate-500 hover:text-slate-300 text-sm mb-3 transition-colors">← Back to Guards</button>
        <h1 className="text-2xl font-black text-slate-100">Add New Guard</h1>
        <p className="text-slate-500 text-sm mt-1">Fill in the form to register a new security guard.</p>
      </div>

      {/* Form Card */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-5">

        {/* Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full Name"    value={form.name}       onChange={set("name")}       placeholder="John Smith"   required />
          <Field label="Badge Number" value={form.badge}      onChange={set("badge")}      placeholder="GD-007"       required />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Phone Number" value={form.phone}      onChange={set("phone")}      placeholder="+1-555-0100"  required />
          <Field label="Experience"   value={form.experience} onChange={set("experience")} placeholder="e.g. 3 yrs" />
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Shift"        value={form.shift}  onChange={set("shift")}  options={["Day", "Night", "Flexible"]} />
          <Field label="Default Zone" value={form.zone}   onChange={set("zone")}   options={["Zone A", "Zone B", "Zone C", "Zone D"]} />
          <Field label="Price ($/hr)" value={form.price}  onChange={set("price")}  type="number" placeholder="25" />
        </div>

        {/* Success message */}
        {saved && (
          <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg px-4 py-3 text-emerald-400 font-semibold text-sm text-center">
            ✅ Guard registered successfully!
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-lg transition-colors text-sm"
        >
          Register Guard
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// PAGE: GUARD DETAIL / EDIT
// ─────────────────────────────────────────────
const GuardDetail = ({ guardId, guards, setGuards, setPage }) => {
  const guard = guards.find(g => g.id === guardId);
  const [form, setForm] = useState(guard ? { ...guard } : {});
  const [saved, setSaved] = useState(false);

  if (!guard) return <p className="text-slate-400">Guard not found.</p>;

  const set = key => val => setForm(p => ({ ...p, [key]: val }));

  const handleSave = () => {
    setGuards(prev => prev.map(g => g.id === guard.id ? { ...g, ...form, price: Number(form.price) || 0 } : g));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <button onClick={() => setPage("guards")} className="text-slate-500 hover:text-slate-300 text-sm mb-3 transition-colors">← Back to Guards</button>
        <div className="flex items-center gap-4">
          <Avatar name={guard.name} size="w-14 h-14" textSize="text-lg" />
          <div>
            <h1 className="text-2xl font-black text-slate-100">{guard.name}</h1>
            <p className="text-slate-500 text-sm">{guard.badge} · <StatusBadge status={guard.status} /></p>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-5">
        <p className="text-slate-400 text-xs uppercase font-semibold tracking-widest border-b border-slate-700 pb-3">Edit Guard Details</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full Name"    value={form.name}       onChange={set("name")}       placeholder="Full name" />
          <Field label="Badge Number" value={form.badge}      onChange={set("badge")}      placeholder="GD-001" />
          <Field label="Phone"        value={form.phone}      onChange={set("phone")}      placeholder="+1-555-0000" />
          <Field label="Experience"   value={form.experience} onChange={set("experience")} placeholder="e.g. 5 yrs" />
          <Field label="Shift"        value={form.shift}      onChange={set("shift")}      options={["Day", "Night", "Flexible", "—"]} />
          <Field label="Zone"         value={form.zone}       onChange={set("zone")}       options={["Zone A", "Zone B", "Zone C", "Zone D", "—"]} />
          <Field label="Price ($/hr)" value={form.price}      onChange={set("price")}      type="number" placeholder="25" />
          <Field label="Status"       value={form.status}     onChange={set("status")}     options={["available", "on-duty", "suspended"]} />
        </div>

        {saved && (
          <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg px-4 py-3 text-emerald-400 font-semibold text-sm text-center">
            ✅ Changes saved!
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-lg transition-colors text-sm"
          >
            Save Changes
          </button>
          <button
            onClick={() => setPage("guards")}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold py-3 rounded-lg transition-colors text-sm border border-slate-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// PAGE: BOOKINGS
// ─────────────────────────────────────────────
const Bookings = ({ bookings, setBookings }) => {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? bookings : bookings.filter(b => b.status === filter);

  const confirm = id => setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "confirmed" } : b));
  const cancel  = id => setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "cancelled" } : b));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-100">Bookings</h1>
        <p className="text-slate-500 text-sm mt-1">{bookings.filter(b => b.status === "pending").length} bookings awaiting confirmation</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {["all", "pending", "confirmed", "cancelled"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm capitalize transition-colors border ${
              filter === f
                ? "bg-amber-500 text-black border-amber-500"
                : "bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500"
            }`}
          >
            {f === "all" ? "All" : f}
          </button>
        ))}
      </div>

      {/* Booking list */}
      <div className="space-y-3">
        {filtered.map(b => (
          <div key={b.id} className="bg-slate-800 border border-slate-700 rounded-xl px-5 py-4 flex flex-wrap items-center gap-4 hover:border-slate-500 transition-colors">
            <span className="text-amber-400 font-black text-sm w-20">{b.id}</span>

            <div className="flex-1 min-w-40">
              <p className="text-slate-100 font-bold">{b.client}</p>
              <p className="text-slate-500 text-xs mt-0.5">{b.location} · {b.time}</p>
            </div>

            <div className="min-w-32">
              <p className="text-slate-500 text-xs uppercase font-semibold tracking-widest">Guard</p>
              <p className="text-slate-200 text-sm font-semibold">{b.guard}</p>
            </div>

            <div className="min-w-28">
              <p className="text-slate-500 text-xs uppercase font-semibold tracking-widest">Date</p>
              <p className="text-slate-200 text-sm">{b.date}</p>
            </div>

            <div className="flex items-center gap-2">
              <StatusBadge status={b.status} />
              {b.status === "pending" && (
                <>
                  <button
                    onClick={() => confirm(b.id)}
                    className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => cancel(b.id)}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// PAGE: AVAILABLE GUARDS
// ─────────────────────────────────────────────
const AvailableGuards = ({ guards }) => {
  const available = guards.filter(g => g.status === "available");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-100">Available Guards</h1>
        <p className="text-slate-500 text-sm mt-1">{available.length} guards ready for deployment</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {available.map(g => (
          <div key={g.id} className="bg-slate-800 border border-emerald-500/20 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-3">
              <Avatar name={g.name} />
              <div>
                <p className="text-slate-100 font-bold">{g.name}</p>
                <p className="text-slate-500 text-xs">{g.badge}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[["Shift", g.shift], ["Zone", g.zone], ["Experience", g.experience], ["Rating", `★ ${g.rating}`]].map(([k, v]) => (
                <div key={k} className="bg-slate-700/50 rounded-lg px-3 py-2">
                  <p className="text-slate-500 text-xs uppercase font-semibold tracking-widest">{k}</p>
                  <p className="text-slate-200 text-sm font-bold mt-0.5">{v}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between bg-slate-700/30 border border-emerald-500/20 rounded-lg px-4 py-2.5">
              <span className="text-emerald-400 font-bold text-sm">🟢 Ready to Deploy</span>
              <span className="text-amber-400 font-black">${g.price}/hr</span>
            </div>
          </div>
        ))}
        {available.length === 0 && (
          <p className="col-span-3 text-slate-500 text-center py-12">No guards currently available.</p>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// SIDEBAR NAVIGATION
// ─────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard",  label: "Dashboard",       icon: "⊞" },
  { id: "guards",     label: "Guards",           icon: "🛡" },
  { id: "add-guard",  label: "Add Guard",        icon: "➕" },
  { id: "bookings",   label: "Bookings",         icon: "📋" },
  { id: "available",  label: "Available Guards", icon: "✅" },
];

const Sidebar = ({ page, setPage }) => (
  <aside className="w-56 bg-slate-900 border-r border-slate-800 flex flex-col min-h-screen flex-shrink-0">
    {/* Brand */}
    <div className="px-5 py-6 border-b border-slate-800">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center text-lg">🛡</div>
        <div>
          <p className="text-slate-100 font-black text-base leading-tight">GuardOps</p>
          <p className="text-slate-600 text-xs font-semibold uppercase tracking-widest">Admin</p>
        </div>
      </div>
    </div>

    {/* Nav */}
    <nav className="flex-1 px-3 py-4 space-y-1">
      {NAV_ITEMS.map(n => {
        const active = page === n.id || (n.id === "guards" && page === "guard-detail");
        return (
          <button
            key={n.id}
            onClick={() => setPage(n.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors text-left ${
              active
                ? "bg-amber-500/20 text-amber-400"
                : "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
            }`}
          >
            <span className="text-base">{n.icon}</span>
            {n.label}
            {active && <span className="ml-auto w-1.5 h-1.5 bg-amber-400 rounded-full" />}
          </button>
        );
      })}
    </nav>

    {/* Admin footer */}
    <div className="px-5 py-4 border-t border-slate-800">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">AD</div>
        <div>
          <p className="text-slate-300 text-sm font-bold">Admin</p>
          <p className="text-slate-600 text-xs">Company Manager</p>
        </div>
      </div>
    </div>
  </aside>
);

// ─────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────
export default function App() {
  const [page, setPage]           = useState("dashboard");
  const [guards, setGuards]       = useState(MOCK_GUARDS);
  const [bookings, setBookings]   = useState(MOCK_BOOKINGS);
  const [activeGuardId, setActiveGuardId] = useState(null);

  // Navigate to guard detail page
  const openGuard = (guard) => { setActiveGuardId(guard.id); setPage("guard-detail"); };

  const renderPage = () => {
    switch (page) {
      case "dashboard":    return <Dashboard     guards={guards} bookings={bookings} />;
      case "guards":       return <GuardsList    guards={guards} setGuards={setGuards} setPage={setPage} setActiveGuard={openGuard} />;
      case "add-guard":    return <AddGuard      setGuards={setGuards} setPage={setPage} />;
      case "guard-detail": return <GuardDetail   guardId={activeGuardId} guards={guards} setGuards={setGuards} setPage={setPage} />;
      case "bookings":     return <Bookings      bookings={bookings} setBookings={setBookings} />;
      case "available":    return <AvailableGuards guards={guards} />;
      default:             return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar page={page} setPage={setPage} />
      <main className="flex-1 p-8 overflow-y-auto max-h-screen">
        {renderPage()}
      </main>
    </div>
  );
}