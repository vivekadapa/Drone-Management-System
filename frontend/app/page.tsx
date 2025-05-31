import React from 'react';
import Link from 'next/link';

const modules = [
  {
    title: 'Mission Planner',
    description: 'Plan and configure drone missions, define areas, waypoints, and parameters.',
    href: '/mission-planner',
  },
  {
    title: 'Fleet Dashboard',
    description: 'View and manage all drones, see real-time status and telemetry.',
    href: '/fleet-dashboard',
  },
  {
    title: 'Mission Monitoring',
    description: 'Monitor ongoing missions, view live progress, and control missions.',
    href: '/mission-monitoring',
  },
  {
    title: 'Reporting & Analytics',
    description: 'Analyze mission data, view summaries, and organization-level metrics.',
    href: '/reporting',
  },
];

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold text-center mb-2 text-gray-900">Drone Management System</h1>
      <p className="text-lg text-center text-gray-500 mb-10">Plan, monitor, and analyze your drone missions with ease.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {modules.map((mod) => (
          <div key={mod.title} className="bg-white rounded-xl shadow p-6 flex flex-col justify-between border border-gray-100">
            <div>
              <h2 className="text-xl font-semibold mb-2 text-gray-800">{mod.title}</h2>
              <p className="text-gray-500 mb-4 text-sm">{mod.description}</p>
            </div>
            <Link href={mod.href} className="inline-block w-full mt-auto">
              <button className="w-full py-2 px-4 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold transition">Go to {mod.title}</button>
            </Link>
          </div>
        ))}
        </div>
    </div>
  );
}
