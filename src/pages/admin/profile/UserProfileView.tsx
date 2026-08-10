import { useState } from "react";
import { KeyRound, ShieldCheck } from "lucide-react";

const permissionsList = [
  "Read Telemetry",
  "Deploy Missions",
  "Approve Invoices",
  "Create Reports",
  "Manage Users",
  "Configure System",
];

export function UserProfileView() {
  const [profileData, setProfileData] = useState({
    name: "Admin User",
    email: "ops@spatioagri.com",
    phone: "+94 77 123 4567",
    department: "Operations Manager",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-medium tracking-tight text-slate-900 font-display">
          User Profile
        </h1>
        <p className="text-slate-400 text-xs md:text-sm mt-1 font-normal">
          Manage your personal account settings, role permissions, and credentials
        </p>
      </div>

      {/* Profile Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Profile Info & Permissions (2/3 width on large screen) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Profile Information */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
            <h3 className="text-xl font-normal text-slate-900 font-display">
              Personal Information
            </h3>

            {/* Avatar block with initials */}
            <div className="flex items-center gap-4 pb-2">
              <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-800 text-lg font-normal flex items-center justify-center shadow-xs select-none">
                AU
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-slate-700 leading-none">Profile Picture</h4>
                <p className="text-[10px] text-slate-400 font-normal">
                  Initial icon generated from account initials
                </p>
              </div>
            </div>

            {/* Form grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs text-slate-500 font-normal block mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => handleProfileChange("name", e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-white focus:outline-none focus:border-slate-450 text-slate-800 font-normal"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 font-normal block mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleProfileChange("email", e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-white focus:outline-none focus:border-slate-450 text-slate-800 font-normal"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 font-normal block mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={profileData.phone}
                  onChange={(e) => handleProfileChange("phone", e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-white focus:outline-none focus:border-slate-450 text-slate-800 font-normal"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 font-normal block mb-1.5">
                  Role / Position
                </label>
                <input
                  type="text"
                  value={profileData.department}
                  disabled
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-slate-50 text-slate-400 font-normal cursor-not-allowed"
                />
              </div>
            </div>

            <button className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 border border-slate-300 rounded-lg text-xs font-normal transition-colors cursor-pointer block">
              Save Changes
            </button>
          </div>

          {/* Card 2: Role Permissions */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <h3 className="text-xl font-normal text-slate-900 font-display">
                Authorized Scopes & Permissions
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-normal max-w-xl leading-relaxed">
              Your account is assigned the **Operations Manager** system role. The following policy
              tags determine what actions you can execute inside the SpatioAgri admin dashboard:
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {permissionsList.map((perm) => (
                <span
                  key={perm}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-xs font-normal"
                >
                  {perm}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Security (1/3 width on large screen) */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-slate-400" />
              <h3 className="text-xl font-normal text-slate-900 font-display">Change Password</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 font-normal block mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-white focus:outline-none focus:border-slate-450 text-slate-800 font-normal"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 font-normal block mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-white focus:outline-none focus:border-slate-450 text-slate-800 font-normal"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 font-normal block mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-white focus:outline-none focus:border-slate-450 text-slate-800 font-normal"
                />
              </div>
            </div>

            <button className="w-full px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 border border-slate-300 rounded-lg text-xs font-normal transition-colors cursor-pointer block text-center">
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
