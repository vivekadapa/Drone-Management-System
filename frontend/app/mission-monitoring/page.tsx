"use client";
import React, { useEffect, useState } from "react";
import { HiOutlineLocationMarker, HiOutlineClock, HiOutlineChartBar } from "react-icons/hi";
import dynamic from "next/dynamic";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

const MissionMap = dynamic(() => import("./MissionMap"), { ssr: false });

type TelemetryData = {
  timestamp: string;
  latitude: number;
  longitude: number;
  altitude: number;
  speed: number;
  batteryLevel: number;
  heading: number;
  signalStrength: number;
};

type Mission = {
  id: string;
  name: string;
  status: "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "ABORTED";
  startTime: string;
  drone: {
    id: string;
    name: string;
  };
  waypoints: {
    id: string;
    latitude: number;
    longitude: number;
    altitude: number;
    status: "PENDING" | "COMPLETED" | "SKIPPED";
  }[];
  telemetry: TelemetryData[];
};

export default function MissionMonitoring() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchMissions() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/missions/active`);
      if (!res.ok) throw new Error("Failed to fetch missions");
      const data = await res.json();
      setMissions(data);
      
      // Update selected mission if it exists in the new data
      if (selectedMission) {
        const updated = data.find((m: Mission) => m.id === selectedMission.id);
        if (updated) setSelectedMission(updated);
      }
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }

  // Poll for updates every 2 seconds
  useEffect(() => {
    fetchMissions();
    const interval = setInterval(fetchMissions, 2000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PLANNED": return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS": return "bg-green-100 text-green-800";
      case "COMPLETED": return "bg-gray-100 text-gray-800";
      case "ABORTED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getWaypointStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED": return "bg-green-100 text-green-800";
      case "SKIPPED": return "bg-yellow-100 text-yellow-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Mission Monitoring</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mission List */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
              <h2 className="text-lg font-semibold mb-4">Active Missions</h2>
              <div className="space-y-4">
                {missions.map((mission) => (
                  <div 
                    key={mission.id}
                    className={`p-4 rounded-lg border transition cursor-pointer ${
                      selectedMission?.id === mission.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedMission(mission)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{mission.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(mission.status)}`}>
                        {mission.status.replace("_", " ")}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <HiOutlineLocationMarker className="w-5 h-5 text-gray-400" />
                        <span>Drone: {mission.drone.name}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <HiOutlineClock className="w-5 h-5 text-gray-400" />
                        <span>Started: {new Date(mission.startTime).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mission Details and Map */}
          <div className="lg:col-span-2 space-y-6">
            {selectedMission ? (
              <>
                {/* Map View */}
                <div className="bg-white rounded-lg shadow p-6 border border-gray-100 h-[400px]">
                  <MissionMap mission={selectedMission} />
                </div>

                {/* Telemetry Data */}
                <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
                  <h2 className="text-lg font-semibold mb-4">Live Telemetry</h2>
                  {selectedMission.telemetry.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 rounded-lg bg-gray-50">
                        <div className="text-sm text-gray-600">Altitude</div>
                        <div className="text-xl font-semibold">
                          {selectedMission.telemetry[0].altitude.toFixed(1)}m
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-gray-50">
                        <div className="text-sm text-gray-600">Speed</div>
                        <div className="text-xl font-semibold">
                          {selectedMission.telemetry[0].speed.toFixed(1)}m/s
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-gray-50">
                        <div className="text-sm text-gray-600">Battery</div>
                        <div className="text-xl font-semibold">
                          {selectedMission.telemetry[0].batteryLevel}%
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-gray-50">
                        <div className="text-sm text-gray-600">Signal</div>
                        <div className="text-xl font-semibold">
                          {selectedMission.telemetry[0].signalStrength}%
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500">No telemetry data available</div>
                  )}
                </div>

                {/* Waypoints Progress */}
                <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
                  <h2 className="text-lg font-semibold mb-4">Waypoints Progress</h2>
                  <div className="space-y-2">
                    {selectedMission.waypoints.map((wp, index) => (
                      <div key={wp.id} className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm">
                            {wp.latitude.toFixed(4)}, {wp.longitude.toFixed(4)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Altitude: {wp.altitude}m
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getWaypointStatusColor(wp.status)}`}>
                          {wp.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 border border-gray-100 text-center text-gray-500">
                Select a mission to view details
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 