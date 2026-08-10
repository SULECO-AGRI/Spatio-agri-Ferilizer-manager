import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ClipboardList,
  UserCheck,
  Users,
  FileText,
  CreditCard,
  Settings,
  User,
  Menu,
  X,
  ArrowLeft,
} from "lucide-react";

export type TabId =
  "dashboard" | "requests" | "pilots" | "farmers" | "reports" | "payments" | "settings" | "profile";

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const menuItems = [
  { id: "dashboard" as TabId, label: "Dashboard", icon: LayoutDashboard },
  { id: "requests" as TabId, label: "Service Requests", icon: ClipboardList },
  { id: "pilots" as TabId, label: "Pilot Management", icon: UserCheck },
  { id: "farmers" as TabId, label: "Farmers", icon: Users },
  { id: "reports" as TabId, label: "Reports", icon: FileText },
  { id: "payments" as TabId, label: "Payments", icon: CreditCard },
  { id: "settings" as TabId, label: "Settings", icon: Settings },
  { id: "profile" as TabId, label: "User Profile", icon: User },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-[100] p-2 rounded-lg bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-white border-r border-slate-200 transition-transform duration-300 lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header / Logo */}
        <div className="p-6 flex items-center gap-3 border-b border-slate-100 font-sans">
          <svg className="w-9 h-9 shrink-0 shadow-xs rounded-lg" viewBox="0 0 32 32">
            <rect width="32" height="32" rx="8" fill="#062419" />
            <path d="M9 21c4-1 7-4 8-12 5 4 5 12-1 14-3 1-6-.5-7-2Z" fill="#10b981" />
            <path
              d="M9 21c3-1 6-4 8-12"
              stroke="#d1fae5"
              stroke-opacity="0.7"
              stroke-width="1"
              fill="none"
              stroke-linecap="round"
            />
          </svg>
          <div>
            <h2 className="font-medium text-base text-slate-800 leading-none">SpatioAgri</h2>
            <span className="text-[11px] font-normal text-slate-400 mt-1 block">Admin</span>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto font-sans">
          {menuItems.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => {
                  onTabChange(id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-normal transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-slate-900" : "text-slate-400"}`} />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 font-sans">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-normal text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 transition-all duration-200"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
            <span>Back to Portal Home</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
