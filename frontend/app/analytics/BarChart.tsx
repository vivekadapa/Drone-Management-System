"use client";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type SurveyCoverage = {
  date: string;
  area: number;
  coverage: number;
  quality: "HIGH" | "MEDIUM" | "LOW";
};

export default function BarChart({ timeRange }: { timeRange: "week" | "month" | "year" }) {
  const [data, setData] = useState<SurveyCoverage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/analytics/coverage?timeRange=${timeRange}`);
        if (!res.ok) throw new Error("Failed to fetch data");
        const coverageData = await res.json();
        setData(coverageData);
      } catch (error) {
        console.error("Error fetching coverage data:", error);
      }
      setLoading(false);
    }

    fetchData();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const chartData = {
    labels: data.map(d => new Date(d.date).toLocaleDateString()),
    datasets: [
      {
        label: "Coverage (%)",
        data: data.map(d => d.coverage),
        backgroundColor: data.map(d => {
          switch (d.quality) {
            case "HIGH": return "rgba(34, 197, 94, 0.7)";
            case "MEDIUM": return "rgba(234, 179, 8, 0.7)";
            case "LOW": return "rgba(239, 68, 68, 0.7)";
            default: return "rgba(59, 130, 246, 0.7)";
          }
        }),
        borderColor: data.map(d => {
          switch (d.quality) {
            case "HIGH": return "rgb(34, 197, 94)";
            case "MEDIUM": return "rgb(234, 179, 8)";
            case "LOW": return "rgb(239, 68, 68)";
            default: return "rgb(59, 130, 246)";
          }
        }),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const index = context.dataIndex;
            const quality = data[index].quality;
            return [
              `Coverage: ${context.raw}%`,
              `Quality: ${quality}`,
              `Area: ${data[index].area.toFixed(2)} km²`,
            ];
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: "Coverage (%)",
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
} 