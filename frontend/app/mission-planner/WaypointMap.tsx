"use client";
import React from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from "react-leaflet";
import type { LatLngExpression, LeafletMouseEvent } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const customIcon = new L.Icon({
  iconUrl: "data:image/svg+xml;base64," + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `),
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
  className: "text-blue-600"
});

type Waypoint = {
  id?: string;
  latitude: number;
  longitude: number;
  altitude?: number;
  direction?: number;
  sensors?: string;
  frequency?: number;
};

export default function WaypointMap({
  waypoints,
  onAdd,
}: {
  waypoints: Waypoint[];
  onAdd: (latlng: { lat: number; lng: number }) => void;
}) {
  const center: LatLngExpression =
    waypoints.length > 0
      ? [waypoints[0].latitude, waypoints[0].longitude]
      : [20, 78];

  function MapClicker() {
    useMapEvents({
      click(e: LeafletMouseEvent) {
        onAdd({ lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });
    return null;
  }

  return (
    <MapContainer
      center={center}
      zoom={6}
      style={{ height: 350, width: "100%" }}
      className="mb-4 rounded shadow z-0"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapClicker />
      {waypoints.map((wp, i) => (
        <Marker 
          key={wp.id || i} 
          position={[wp.latitude, wp.longitude]}
          icon={customIcon}
        />
      ))}
      {waypoints.length > 1 && (
        <Polyline
          pathOptions={{ color: "blue" }}
          positions={waypoints.map((wp) => [wp.latitude, wp.longitude])}
        />
      )}
    </MapContainer>
  );
} 