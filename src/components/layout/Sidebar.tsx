import { useState, memo } from "react";
import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ClipboardList,
  UserCheck,
  Users,
  MapPin,
  FileText,
  CreditCard,
  Settings,
  User,
  Menu,
  X,
  ArrowLeft,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { TabId } from "@/types";

export type { TabId };

export interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const menuConfig = [
  { id: "dashboard" as TabId, key: "dashboard" as const, icon: LayoutDashboard },
  { id: "requests" as TabId, key: "requests" as const, icon: ClipboardList },
  { id: "pilots" as TabId, key: "pilots" as const, icon: UserCheck },
  { id: "farmers" as TabId, key: "farmers" as const, icon: Users },
  { id: "fields" as TabId, key: "fields" as const, icon: MapPin },
  { id: "reports" as TabId, key: "reports" as const, icon: FileText },
  { id: "payments" as TabId, key: "payments" as const, icon: CreditCard },
  { id: "settings" as TabId, key: "settings" as const, icon: Settings },
  { id: "profile" as TabId, key: "profile" as const, icon: User },
];

export const Sidebar = memo(function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { dict, isSinhala } = useLanguage();

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-[100] p-2 rounded-lg bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors cursor-pointer"
        aria-label="Toggle navigation menu"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-white border-r border-slate-200 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header / Brand (Redirect to Landing Page) */}
        <Link
          to="/"
          className="p-6 flex items-center border-b border-slate-100 font-sans cursor-pointer hover:bg-slate-50/80 transition-all group select-none"
          title="Return to Landing Page"
        >
          <div>
            <h2 className="font-semibold text-base text-slate-800 leading-none group-hover:text-emerald-700 transition-colors">
              Fertilizer manager
            </h2>
            <span className="text-[11px] font-normal text-slate-400 mt-1 block">
              {dict.admin.title}
            </span>
          </div>
        </Link>

        {/* Menu Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto font-sans">
          {menuConfig.map(({ id, key, icon: Icon }) => {
            const isActive = activeTab === id;
            const label = dict.admin.tabs[key] || id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  onTabChange(id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-normal transition-all duration-200 cursor-pointer ${
                  isSinhala ? "font-sinhala leading-snug" : ""
                } ${
                  isActive
                    ? "bg-slate-100 text-slate-900 font-medium"
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-slate-900" : "text-slate-400"}`} />
                <span className="truncate">{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 font-sans">
          <Link
            to="/"
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-normal text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 transition-all duration-200 ${
              isSinhala ? "font-sinhala" : ""
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{dict.common.backHome}</span>
          </Link>
        </div>
      </aside>
    </>
  );
});

export default Sidebar;
