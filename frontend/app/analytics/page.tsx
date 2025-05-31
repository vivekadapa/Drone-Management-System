"use client";
import React, { useEffect, useState } from "react";
import { HiOutlineChartBar, HiOutlineClock, HiOutlineLocationMarker, HiOutlineDocumentReport } from "react-icons/hi";
import dynamic from "next/dynamic";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

// Import Chart.js components
const LineChart = dynamic(() => import("./LineChart"), { ssr: false });
const BarChart = dynamic(() => import("./BarChart"), { ssr: false });

type MissionStats = {
  totalMissions: number;
  completedMissions: number;
  totalFlightTime: number;
  totalDistance: number;
  averageBatteryUsage: number;
  successRate: number;
};

type SurveyReport = {
  id: string;
  missionId: string;
  missionName: string;
  date: string;
  area: number;
  coverage: number;
  dataPoints: number;
  quality: "HIGH" | "MEDIUM" | "LOW";
  status: "PROCESSING" | "COMPLETED" | "FAILED";
};

export default function AnalyticsPage() {
  const [stats, setStats] = useState<MissionStats | null>(null);
  const [reports, setReports] = useState<SurveyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("week");

  async function fetchData() {
    setLoading(true);
    setError("");
    try {
      const [statsRes, reportsRes] = await Promise.all([
        fetch(`${API_BASE}/api/analytics/stats?timeRange=${timeRange}`),
        fetch(`${API_BASE}/api/analytics/reports?timeRange=${timeRange}`)
      ]);

      if (!statsRes.ok || !reportsRes.ok) throw new Error("Failed to fetch data");
      
      const [statsData, reportsData] = await Promise.all([
        statsRes.json(),
        reportsRes.json()
      ]);

      setStats(statsData);
      setReports(reportsData);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "HIGH": return "bg-green-100 text-green-800";
      case "MEDIUM": return "bg-yellow-100 text-yellow-800";
      case "LOW": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED": return "bg-green-100 text-green-800";
      case "PROCESSING": return "bg-blue-100 text-blue-800";
      case "FAILED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Survey Analytics</h1>
        <div className="flex gap-2">
          <button
            className={`px-3 py-2 rounded transition ${
              timeRange === "week" 
                ? "bg-blue-600 text-white" 
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => setTimeRange("week")}
          >
            Week
          </button>
          <button
            className={`px-3 py-2 rounded transition ${
              timeRange === "month" 
                ? "bg-blue-600 text-white" 
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => setTimeRange("month")}
          >
            Month
          </button>
          <button
            className={`px-3 py-2 rounded transition ${
              timeRange === "year" 
                ? "bg-blue-600 text-white" 
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => setTimeRange("year")}
          >
            Year
          </button>
        </div>
      </div>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats Overview */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-blue-100">
                    <HiOutlineChartBar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Total Missions</div>
                    <div className="text-2xl font-semibold">{stats.totalMissions}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-green-100">
                    <HiOutlineClock className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Flight Time</div>
                    <div className="text-2xl font-semibold">{stats.totalFlightTime}h</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-yellow-100">
                    <HiOutlineLocationMarker className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Total Distance</div>
                    <div className="text-2xl font-semibold">{stats.totalDistance}km</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-purple-100">
                    <HiOutlineDocumentReport className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                    <div className="text-2xl font-semibold">{stats.successRate}%</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
              <h2 className="text-lg font-semibold mb-4">Mission Activity</h2>
              <div className="h-80">
                <LineChart timeRange={timeRange} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
              <h2 className="text-lg font-semibold mb-4">Survey Coverage</h2>
              <div className="h-80">
                <BarChart timeRange={timeRange} />
              </div>
            </div>
          </div>

          {/* Survey Reports */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Recent Survey Reports</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Mission</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Area</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Coverage</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Data Points</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Quality</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">{report.missionName}</td>
                      <td className="py-3 px-4">{new Date(report.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4">{report.area.toFixed(2)} km²</td>
                      <td className="py-3 px-4">{report.coverage}%</td>
                      <td className="py-3 px-4">{report.dataPoints.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getQualityColor(report.quality)}`}>
                          {report.quality}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 