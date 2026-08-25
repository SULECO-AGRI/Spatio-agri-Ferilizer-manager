import { useNavigate } from "@tanstack/react-router";
import { Search, Columns, CloudSun, Radio, PlayCircle, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function Topbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : "Admin User";
  const initials = user
    ? `${user.firstName?.[0] || "A"}${user.lastName?.[0] || "U"}`.toUpperCase()
    : "AU";
  const roleDisplay =
    user?.profile?.accessLevel || user?.profile?.department || user?.role || "Operations";

  const handleLogout = async () => {
    logout();
    await navigate({ to: "/" });
  };

  return (
    <header className="w-full flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-100 font-sans">
      {/* Left Search Bar & Sidebar Toggle */}
      <div className="flex items-center gap-3 w-full md:max-w-md">
        <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors cursor-pointer shrink-0">
          <Columns className="w-4 h-4" />
        </button>

        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search requests, pilots, farmers..."
            className="w-full pl-11 pr-4 py-2 rounded-lg text-sm bg-white border border-slate-200 focus:outline-none focus:border-slate-400 transition-colors placeholder:text-slate-400 text-slate-800 font-normal"
          />
        </div>
      </div>

      {/* Right Stats & Profile */}
      <div className="flex flex-wrap items-center justify-end gap-4 w-full md:w-auto">
        <div className="flex items-center gap-2">
          {/* Weather Widget */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-normal border border-slate-200 bg-white text-slate-600">
            <CloudSun className="w-3.5 h-3.5 text-slate-400" />
            <span>28°C Clear</span>
          </div>

          {/* Online Pilots */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-normal border border-slate-200 bg-white text-slate-600">
            <Radio className="w-3.5 h-3.5 text-slate-400" />
            <span>12 Online</span>
          </div>

          {/* Active Missions */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-normal border border-slate-200 bg-white text-slate-600">
            <PlayCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>5 Active</span>
          </div>
        </div>

        {/* User Block & Logout */}
        <div className="flex items-center gap-3 pl-2 py-1 select-none">
          <div className="text-right leading-none">
            <p className="text-xs font-medium text-slate-800">{fullName}</p>
            <span className="text-[10px] font-normal text-slate-400 uppercase tracking-wide mt-1 block">
              {roleDisplay}
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-medium text-xs flex items-center justify-center shadow-xs">
            {initials}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title="Sign out of Admin Dashboard"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-colors cursor-pointer ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
