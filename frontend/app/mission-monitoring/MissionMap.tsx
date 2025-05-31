"use client";
import React from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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
  telemetry: {
    timestamp: string;
    latitude: number;
    longitude: number;
    altitude: number;
    speed: number;
    batteryLevel: number;
    heading: number;
    signalStrength: number;
  }[];
};

const getWaypointIcon = (status: string) => {
  let color = "blue";
  if (status === "COMPLETED") color = "green";
  if (status === "SKIPPED") color = "red";

  return new L.Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    `)}`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
};

const getDroneIcon = (batteryLevel: number) => {
  let color = "blue";
  if (batteryLevel > 70) color = "green";
  if (batteryLevel < 30) color = "red";

  return new L.Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    `)}`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
};

export default function MissionMap({ mission }: { mission: Mission }) {
  const center: LatLngExpression =
    mission.telemetry.length > 0
      ? [mission.telemetry[0].latitude, mission.telemetry[0].longitude]
      : mission.waypoints.length > 0
      ? [mission.waypoints[0].latitude, mission.waypoints[0].longitude]
      : [20, 78];

  return (
    <MapContainer
      center={center}
      zoom={6}
      style={{ height: "100%", width: "100%" }}
      className="rounded shadow"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      {/* Draw waypoints */}
      {mission.waypoints.map((wp) => (
        <Marker
          key={wp.id}
          position={[wp.latitude, wp.longitude]}
          icon={getWaypointIcon(wp.status)}
        >
          <Popup>
            <div className="p-2">
              <div className="font-medium">Waypoint</div>
              <div className="text-sm text-gray-600">
                <div>Status: {wp.status}</div>
                <div>Altitude: {wp.altitude}m</div>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Draw waypoint connections */}
      {mission.waypoints.length > 1 && (
        <Polyline
          pathOptions={{ color: "blue", dashArray: "5, 5" }}
          positions={mission.waypoints.map((wp) => [wp.latitude, wp.longitude])}
        />
      )}

      {/* Draw drone location */}
      {mission.telemetry.length > 0 && (
        <Marker
          position={[mission.telemetry[0].latitude, mission.telemetry[0].longitude]}
          icon={getDroneIcon(mission.telemetry[0].batteryLevel)}
        >
          <Popup>
            <div className="p-2">
              <div className="font-medium">{mission.drone.name}</div>
              <div className="text-sm text-gray-600">
                <div>Battery: {mission.telemetry[0].batteryLevel}%</div>
                <div>Altitude: {mission.telemetry[0].altitude.toFixed(1)}m</div>
                <div>Speed: {mission.telemetry[0].speed.toFixed(1)}m/s</div>
              </div>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
} 