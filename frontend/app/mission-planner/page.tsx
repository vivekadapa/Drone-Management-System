"use client";
import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

const WaypointMap = dynamic(() => import("./WaypointMap"), { ssr: false });

function MissionForm({ onSave, onCancel, initial }: any) {
  const [form, setForm] = useState(
    initial || { name: "",droneId:"", area: {}, flightPath: {}, status: "PLANNED" }
  );
  const [availableDrones, setAvailableDrones] = useState<any[]>([]);
  const [loadingDrones, setLoadingDrones] = useState(false);

  useEffect(() => {
    async function fetchAvailableDrones() {
      setLoadingDrones(true);
      try {
        const res = await fetch(`${API_BASE}/api/drones`);
        if (!res.ok) throw new Error("Failed to fetch drones");
        const drones = await res.json();
        setAvailableDrones(drones);
      } catch (error) {
        console.error("Error fetching drones:", error);
      }
      setLoadingDrones(false);
    }
    fetchAvailableDrones();
  }, []);

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
          placeholder="Mission Name"
          value={form.name}
          onChange={e => setForm((f: typeof form) => ({ ...f, name: e.target.value }))}
          required
        />
      </div>
      <div className="flex flex-col space-y-2">
        <select
          className="border px-2 py-1 rounded w-full focus:ring-2 focus:ring-blue-200 transition"
          value={form.droneId}
          onChange={e => setForm((f: typeof form) => ({ ...f, droneId: e.target.value }))}
          required
          disabled={loadingDrones}
        >
          <option value="">Select a drone</option>
          {availableDrones.map(drone => (
            <option key={drone.id} value={drone.id}>
              {drone.name} (Battery: {drone.batteryLevel}%)
            </option>
          ))}
        </select>
        {loadingDrones && (
          <div className="text-sm text-gray-500">Loading available drones...</div>
        )}
      </div>
      <div className="flex flex-col space-y-2">
        <select
          className="border px-2 py-1 rounded w-full focus:ring-2 focus:ring-blue-200 transition"
          value={form.status}
          onChange={e => setForm((f: typeof form) => ({ ...f, status: e.target.value }))}
        >
          {["PLANNED", "IN_PROGRESS", "COMPLETED", "ABORTED"].map(s => (
            <option key={s} value={s}>{s.replace("_", " ")}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 active:bg-gray-300 transition" onClick={onCancel}>Cancel</button>
        <button type="submit" className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white transition">Save</button>
      </div>
    </form>
  );
}

function MissionDialog({ open, onClose, onSave, initial, isSaving }: any) {
  const [show, setShow] = useState(open);
  React.useEffect(() => {
    if (open) setShow(true);
    else setTimeout(() => setShow(false), 200);
  }, [open]);
  return (
    <>{(open || show) && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className={`absolute inset-0 bg-black/30 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
        <div className={`bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative z-10 transform transition-all duration-200 ${open ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`} style={{ pointerEvents: open ? 'auto' : 'none' }}>
          <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl font-bold transition" onClick={onClose} aria-label="Close">×</button>
          <h2 className="text-lg font-semibold mb-4">{initial ? "Edit Mission" : "Add Mission"}</h2>
          <MissionForm onSave={onSave} onCancel={onClose} initial={initial} />
        </div>
      </div>
    )}</>
  );
}

function WaypointForm({ onSave, onCancel, initial, latlng, isSaving }: { onSave: (wp: any) => void, onCancel: () => void, initial?: any, latlng?: { lat: number, lng: number }, isSaving: boolean }) {
  const [form, setForm] = useState(initial || { latitude: latlng?.lat || 0, longitude: latlng?.lng || 0, altitude: 0, direction: 0, sensors: "", frequency: 1 });
  return (
    <form className="space-y-4" onSubmit={(e: React.FormEvent) => { e.preventDefault(); onSave(form); }}>
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium text-gray-700" htmlFor="latitude">Latitude</label>
        <input id="latitude" className="border px-2 py-1 rounded w-full" type="number" placeholder="Latitude" value={form.latitude} onChange={e => setForm((f: typeof form) => ({ ...f, latitude: Number((e as React.ChangeEvent<HTMLInputElement>).target.value) }))} required />
        <label className="text-sm font-medium text-gray-700" htmlFor="longitude">Longitude</label>
        <input id="longitude" className="border px-2 py-1 rounded w-full" type="number" placeholder="Longitude" value={form.longitude} onChange={e => setForm((f: typeof form) => ({ ...f, longitude: Number((e as React.ChangeEvent<HTMLInputElement>).target.value) }))} required />
        <label className="text-sm font-medium text-gray-700" htmlFor="altitude">Altitude (m)</label>
        <input id="altitude" className="border px-2 py-1 rounded w-full" type="number" placeholder="Altitude (m)" value={form.altitude} onChange={e => setForm((f: typeof form) => ({ ...f, altitude: Number((e as React.ChangeEvent<HTMLInputElement>).target.value) }))} required />
        <label className="text-sm font-medium text-gray-700" htmlFor="direction">Direction (deg)</label>
        <input id="direction" className="border px-2 py-1 rounded w-full" type="number" placeholder="Direction (deg)" value={form.direction} onChange={e => setForm((f: typeof form) => ({ ...f, direction: Number((e as React.ChangeEvent<HTMLInputElement>).target.value) }))} required />
        <label className="text-sm font-medium text-gray-700" htmlFor="sensors">Sensors</label>
        <input id="sensors" className="border px-2 py-1 rounded w-full" placeholder="Sensors" value={form.sensors} onChange={e => setForm((f: typeof form) => ({ ...f, sensors: (e as React.ChangeEvent<HTMLInputElement>).target.value }))} required />
        <label className="text-sm font-medium text-gray-700" htmlFor="frequency">Frequency (Hz)</label>
        <input id="frequency" className="border px-2 py-1 rounded w-full" type="number" placeholder="Frequency (Hz)" value={form.frequency} onChange={e => setForm((f: typeof form) => ({ ...f, frequency: Number((e as React.ChangeEvent<HTMLInputElement>).target.value) }))} required />
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 active:bg-gray-300 transition" onClick={onCancel}>Cancel</button>
        <button type="submit" className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white transition" disabled={isSaving}>Save</button>
      </div>
    </form>
  );
}

export default function MissionPlannerPage() {
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editMission, setEditMission] = useState<any>(null);
  const [selectedMission, setSelectedMission] = useState<any>(null);
  const [waypoints, setWaypoints] = useState<any[]>([]);
  const [pendingWaypoint, setPendingWaypoint] = useState<{ lat: number; lng: number } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingWaypoints, setIsLoadingWaypoints] = useState(false);
  const [isSavingWaypoint, setIsSavingWaypoint] = useState(false);

  async function fetchMissions() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/missions`);
      if (!res.ok) throw new Error("Failed to fetch");
      const missionsData = await res.json();
      setMissions(missionsData);
      if (missionsData.length > 0 && !selectedMission) {
        setSelectedMission(missionsData[0]);
      }
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }

  async function fetchWaypoints(missionId: string) {
    setIsLoadingWaypoints(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/waypoints/mission/${missionId}`);
      if (!res.ok) throw new Error("Failed to fetch waypoints");
      setWaypoints(await res.json());
    } catch (e: any) {
      setError(e.message);
    }
    setIsLoadingWaypoints(false);
  }

  useEffect(() => { fetchMissions(); }, []);
  useEffect(() => {
    if (selectedMission) fetchWaypoints(selectedMission.id);
    else setWaypoints([]);
  }, [selectedMission]);

  async function handleSave(mission: any) {
    setIsSaving(true);
    setError("");
    try {
      if (editMission) {
        await fetch(`${API_BASE}/api/missions/${editMission.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(mission),
        });
      } else {
        await fetch(`${API_BASE}/api/missions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(mission),
        });
      }
      setShowForm(false);
      setEditMission(null);
      fetchMissions();
    } catch (e: any) {
      setError(e.message);
    }
    setIsSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this mission?")) return;
    setIsDeleting(true);
    setError("");
    try {
      await fetch(`${API_BASE}/api/missions/${id}`, { method: "DELETE" });
      fetchMissions();
      setSelectedMission(null);
    } catch (e: any) {
      setError(e.message);
    }
    setIsDeleting(false);
  }

  async function handleWaypointSave(wp: any) {
    setIsSavingWaypoint(true);
    setError("");
    try {
      if (selectedMission) {
        await fetch(`${API_BASE}/api/waypoints/mission/${selectedMission.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(wp),
        });
      }
      fetchWaypoints(selectedMission.id);
    } catch (e: any) {
      setError(e.message);
    }
    setIsSavingWaypoint(false);
  }

  async function handleWaypointDelete(id: string) {
    if (!confirm("Delete this waypoint?")) return;
    setIsSavingWaypoint(true);
    setError("");
    try {
      await fetch(`${API_BASE}/api/waypoints/${id}`, { method: "DELETE" });
      fetchWaypoints(selectedMission.id);
    } catch (e: any) {
      setError(e.message);
    }
    setIsSavingWaypoint(false);
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Mission Planner</h1>
        <button 
          className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 active:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed" 
          onClick={() => { setShowForm(true); setEditMission(null); }}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "+ Add Mission"}
        </button>
      </div>

      {error && <div className="mb-4 text-red-600">{error}</div>}
      <MissionDialog 
        open={showForm} 
        onClose={() => { setShowForm(false); setEditMission(null); }} 
        onSave={handleSave} 
        initial={editMission}
        isSaving={isSaving}
      />

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Mission Selector */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <select
                className="flex-1 border px-3 py-2 rounded focus:ring-2 focus:ring-blue-200 transition"
                value={selectedMission?.id || ""}
                onChange={(e) => {
                  const mission = missions.find(m => m.id === e.target.value);
                  setSelectedMission(mission || null);
                }}
                disabled={isDeleting}
              >
                <option value="">Select a mission</option>
                {missions.map((mission) => (
                  <option key={mission.id} value={mission.id}>
                    {mission.name} ({mission.status.replace("_", " ")})
                  </option>
                ))}
              </select>
              
              {selectedMission && (
                <div className="flex gap-2">
                  <button 
                    className="px-3 py-2 rounded bg-yellow-100 text-yellow-800 hover:bg-yellow-200 active:bg-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => { setEditMission(selectedMission); setShowForm(true); }}
                    disabled={isSaving || isDeleting}
                  >
                    Edit Mission
                  </button>
                  <button 
                    className="px-3 py-2 rounded bg-red-100 text-red-800 hover:bg-red-200 active:bg-red-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleDelete(selectedMission.id)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete Mission"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Selected Mission Details */}
          {selectedMission && (
            <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">{selectedMission.name}</h2>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    Status: <span className="font-medium">{selectedMission.status.replace("_", " ")}</span>
                  </div>
                  <div>
                    Assigned Drone: <span className="font-medium">{selectedMission.drone?.name || "None"}</span>
                    {selectedMission.drone && (
                      <span className="ml-2">
                        (Battery: {selectedMission.drone.batteryLevel}%)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Waypoints</h3>
                {isLoadingWaypoints ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <>
                    <WaypointMap
                      waypoints={waypoints}
                      onAdd={latlng => setPendingWaypoint(latlng)}
                    />
                    <div className="mt-2 text-sm text-gray-500">Click on the map to add a waypoint.</div>
                  </>
                )}
              </div>

              <div className="overflow-x-auto rounded border border-gray-100">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 py-2 font-semibold text-gray-700">Lat</th>
                      <th className="px-2 py-2 font-semibold text-gray-700">Lng</th>
                      <th className="px-2 py-2 font-semibold text-gray-700">Alt</th>
                      <th className="px-2 py-2 font-semibold text-gray-700">Dir</th>
                      <th className="px-2 py-2 font-semibold text-gray-700">Sensors</th>
                      <th className="px-2 py-2 font-semibold text-gray-700">Freq</th>
                      <th className="px-2 py-2 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {waypoints.map((wp: any) => (
                      <tr key={wp.id} className="border-t border-gray-100 hover:bg-blue-50 transition">
                        <td className="px-2 py-1">{wp.latitude}</td>
                        <td className="px-2 py-1">{wp.longitude}</td>
                        <td className="px-2 py-1">{wp.altitude}</td>
                        <td className="px-2 py-1">{wp.direction}</td>
                        <td className="px-2 py-1">{wp.sensors}</td>
                        <td className="px-2 py-1">{wp.frequency}</td>
                        <td className="px-2 py-1">
                          <button 
                            className="px-2 py-1 rounded bg-red-100 text-red-800 hover:bg-red-200 active:bg-red-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handleWaypointDelete(wp.id)}
                            disabled={isSavingWaypoint}
                          >
                            {isSavingWaypoint ? "Deleting..." : "Delete"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Waypoint Form */}
      {pendingWaypoint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setPendingWaypoint(null)} />
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative z-10">
            <button 
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl font-bold transition" 
              onClick={() => setPendingWaypoint(null)}
              aria-label="Close"
              disabled={isSavingWaypoint}
            >
              ×
            </button>
            <h3 className="text-lg font-semibold mb-4">Add Waypoint</h3>
            <WaypointForm
              onSave={async (wp: any) => {
                await handleWaypointSave({ ...wp, latitude: pendingWaypoint.lat, longitude: pendingWaypoint.lng });
                setPendingWaypoint(null);
              }}
              onCancel={() => setPendingWaypoint(null)}
              latlng={pendingWaypoint}
              isSaving={isSavingWaypoint}
            />
          </div>
        </div>
      )}
    </div>
  );
} 