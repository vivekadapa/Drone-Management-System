import React from 'react';

const orgStats = [
  { label: 'Total Missions', value: 42 },
  { label: 'Success Rate', value: '90%' },
  { label: 'Avg. Mission Duration', value: '18 min' },
  { label: 'Failure Rate', value: '10%' },
];

const missionSummaries = [
  { id: 'MS-001', name: 'Survey Alpha', duration: '15 min', distance: '2.1 km', area: '0.8 km²', status: 'Completed' },
  { id: 'MS-002', name: 'Inspection Bravo', duration: '22 min', distance: '3.0 km', area: '1.2 km²', status: 'Completed' },
  { id: 'MS-003', name: 'Mapping Charlie', duration: '12 min', distance: '1.5 km', area: '0.5 km²', status: 'Failed' },
];

export default function Reporting() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Reporting & Analytics</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {orgStats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow p-4 border border-gray-100 flex flex-col items-center">
            <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
            <span className="text-xs text-gray-500 mt-1 text-center">{stat.label}</span>
          </div>
        ))}
      </div>
      <h2 className="text-xl font-semibold mb-2 text-gray-800">Mission Summaries</h2>
      <div className="border-b border-gray-200 mb-4"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {missionSummaries.map((mission) => (
          <div key={mission.id} className="bg-white rounded-xl shadow p-4 border border-gray-100">
            <div className="font-semibold text-gray-800 mb-1">{mission.name}</div>
            <div className="text-sm text-gray-500">Duration: {mission.duration}</div>
            <div className="text-sm text-gray-500">Distance: {mission.distance}</div>
            <div className="text-sm text-gray-500">Area: {mission.area}</div>
            <div className="text-sm text-gray-500">Status: {mission.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
} 