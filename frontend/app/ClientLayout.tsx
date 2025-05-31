"use client";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { FaHome } from "react-icons/fa";
import { LuNotebook } from "react-icons/lu";
import { MdOutlineMonitorHeart } from "react-icons/md";
import { RiSurveyLine } from "react-icons/ri";
import { FaPlane } from "react-icons/fa";




const icons = {
  Home: (
    <FaHome />
  ),
  "Mission Planner": (
    <LuNotebook />
  ),
  "Fleet Dashboard": (
    <FaPlane />
  ),
  "Mission Monitoring": (
    <MdOutlineMonitorHeart />
  ),
  Reporting: (
    <RiSurveyLine />
  ),
};

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Mission Planner", href: "/mission-planner" },
  { name: "Fleet Dashboard", href: "/fleet-dashboard" },
  { name: "Mission Monitoring", href: "/mission-monitoring" },
  { name: "Reporting", href: "/reporting" },
];

function Breadcrumbs({ pathname }: { pathname: string }) {
  const crumbs = pathname.split("/").filter(Boolean);
  let path = "";
  return (
    <nav className="text-sm text-gray-400 mb-4" aria-label="Breadcrumb">
      <ol className="list-none p-0 inline-flex">
        <li>
          <Link href="/" className="text-blue-600 hover:underline">Home</Link>
        </li>
        {crumbs.map((crumb, idx) => {
          path += "/" + crumb;
          const isLast = idx === crumbs.length - 1;
          return (
            <li key={path} className="flex items-center">
              <span className="mx-2">/</span>
              {isLast ? (
                <span className="text-gray-700 font-medium capitalize">{crumb.replace(/-/g, ' ')}</span>
              ) : (
                <Link href={path} className="text-blue-600 hover:underline capitalize">{crumb.replace(/-/g, ' ')}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function UserDropdown() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="relative">
      <button
        className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 focus:outline-none"
        onClick={() => setOpen((v) => !v)}
        aria-label="User menu"
      >
        U
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-50">
          <Link href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</Link>
          <Link href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Logout</Link>
        </div>
      )}
    </div>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col py-6 px-4 shadow-sm">
        <div className="mb-8">
          <span className="text-2xl font-bold text-blue-600">DroneMS</span>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center gap-2 px-3 py-2 rounded text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-700 transition"
                >
                  {icons[link.name as keyof typeof icons]} <span className="mt-[2px]">{link.name}</span> 
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto pt-8 border-t border-gray-100 text-xs text-gray-400">&copy; {new Date().getFullYear()} DroneMS</div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8 shadow-sm z-10">
          <div className="flex-1 text-lg font-semibold text-gray-800">Drone Management System</div>
          <div className="flex items-center gap-4">
            <span className="text-gray-500">User</span>
            <UserDropdown />
          </div>
        </header>
        <main className="flex-1 p-8 bg-gray-50">
          <Breadcrumbs pathname={pathname} />
          {children}
        </main>
      </div>
    </div>
  );
} 