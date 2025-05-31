"use client";
import React, { useEffect, useState } from "react";

const DRONE_STATUS = ["IDLE", "IN_MISSION", "CHARGING", "MAINTENANCE"];
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

function DroneForm({ onSave, onCancel, initial }: any) {
  const [form, setForm] = useState(
    initial || { name: "", status: "IDLE", batteryLevel: 100, location: "" }
  );
  return (
    <form
      className="space-y-4"
      onSubmit={e => {
        e.preventDefault();
        onSave(form);
      }}
    >
      <div className="flex flex-col space-y-2">
        <input
          className="border px-2 py-1 rounded w-full focus:ring-2 focus:ring-blue-200 transition"
          placeholder="Name"
          value={form.name}
          onChange={e => setForm((f: typeof form) => ({ ...f, name: e.target.value }))}
          required
        />
        <input
          className="border px-2 py-1 rounded w-full focus:ring-2 focus:ring-blue-200 transition"
          placeholder="Location"
          value={form.location}
          onChange={e => setForm((f: typeof form) => ({ ...f, location: e.target.value }))}
          required
        />
      </div>
      <div className="flex flex-col space-y-2">
        <select
          className="border px-2 py-1 rounded w-full focus:ring-2 focus:ring-blue-200 transition"
          value={form.status}
          onChange={e => setForm((f: typeof form) => ({ ...f, status: e.target.value }))}
        >
          {DRONE_STATUS.map(s => (
            <option key={s} value={s}>{s.replace("_", " ")}</option>
          ))}
        </select>
        <input
          className="border px-2 py-1 rounded w-full focus:ring-2 focus:ring-blue-200 transition"
          type="number"
          min={0}
          max={100}
          placeholder="Battery %"
          value={form.batteryLevel}
          onChange={e => setForm((f: typeof form) => ({ ...f, batteryLevel: Number(e.target.value) }))}
          required
        />
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 active:bg-gray-300 transition" onClick={onCancel}>Cancel</button>
        <button type="submit" className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white transition">Save</button>
      </div>
    </form>
  );
}

function DroneDialog({ open, onClose, onSave, initial }: any) {
  const [show, setShow] = useState(open);
  React.useEffect(() => {
    if (open) setShow(true);
    else setTimeout(() => setShow(false), 200);
  }, [open]);
  return (
    <>
      {(open || show) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay with fade-in/out */}
          <div
            className={`absolute inset-0 bg-black/30 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`}
            onClick={onClose}
          />
          {/* Dialog with scale/fade animation */}
          <div
            className={`bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative z-10 transform transition-all duration-200 ${open ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
            style={{ pointerEvents: open ? 'auto' : 'none' }}
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl font-bold transition"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-lg font-semibold mb-4">{initial ? "Edit Drone" : "Add Drone"}</h2>
            <DroneForm onSave={onSave} onCancel={onClose} initial={initial} />
          </div>
        </div>
      )}
    </>
  );
}

export default function FleetDashboard() {
  const [drones, setDrones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editDrone, setEditDrone] = useState<any>(null);

  async function fetchDrones() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/drones`);
      if (!res.ok) throw new Error("Failed to fetch");
      setDrones(await res.json());
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }

  useEffect(() => { fetchDrones(); }, []);

  async function handleSave(drone: any) {
    setError("");
    try {
      if (editDrone) {
        await fetch(`${API_BASE}/api/drones/${editDrone.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(drone),
        });
      } else {
        await fetch(`${API_BASE}/api/drones`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(drone),
        });
      }
      setShowForm(false);
      setEditDrone(null);
      fetchDrones();
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this drone?")) return;
    setError("");
    try {
      await fetch(`${API_BASE}/api/drones/${id}`, { method: "DELETE" });
      fetchDrones();
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Fleet Dashboard</h1>
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 active:bg-blue-800 transition"
          onClick={() => { setShowForm(true); setEditDrone(null); }}
        >
          + Add Drone
        </button>
      </div>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <DroneDialog
        open={showForm}
        onClose={() => { setShowForm(false); setEditDrone(null); }}
        onSave={handleSave}
        initial={editDrone}
      />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow border border-gray-100 bg-white">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Battery (%)</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Location</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {drones.map((drone) => (
                <tr key={drone.id} className="border-t border-gray-100 hover:bg-blue-50 transition">
                  <td className="px-4 py-2">{drone.name}</td>
                  <td className="px-4 py-2">{drone.status.replace("_", " ")}</td>
                  <td className="px-4 py-2">{drone.batteryLevel}</td>
                  <td className="px-4 py-2">{drone.location}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 hover:bg-yellow-200 active:bg-yellow-300 transition"
                      onClick={() => { setEditDrone(drone); setShowForm(true); }}
                    >Edit</button>
                    <button
                      className="px-2 py-1 rounded bg-red-100 text-red-800 hover:bg-red-200 active:bg-red-300 transition"
                      onClick={() => handleDelete(drone.id)}
                    >Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 