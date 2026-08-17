import { useState } from "react";
import { KeyRound, ShieldCheck } from "lucide-react";
import { PageHeader, FormField } from "@/components/ui";

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
      <PageHeader
        title="User Profile"
        description="Manage your personal account settings, role permissions, and credentials"
      />

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
              <FormField
                label="Full Name"
                value={profileData.name}
                onChange={(val) => handleProfileChange("name", val)}
              />

              <FormField
                label="Email Address"
                type="email"
                value={profileData.email}
                onChange={(val) => handleProfileChange("email", val)}
              />

              <FormField
                label="Phone Number"
                value={profileData.phone}
                onChange={(val) => handleProfileChange("phone", val)}
              />

              <FormField label="Role / Position" value={profileData.department} disabled />
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
              Your account is assigned the <strong>Operations Manager</strong> system role. The
              following policy tags determine what actions you can execute inside the Fertilizer
              manager admin dashboard:
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
              <FormField
                label="Current Password"
                type="password"
                value={passwordData.currentPassword}
                onChange={(val) => handlePasswordChange("currentPassword", val)}
              />

              <FormField
                label="New Password"
                type="password"
                value={passwordData.newPassword}
                onChange={(val) => handlePasswordChange("newPassword", val)}
              />

              <FormField
                label="Confirm New Password"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(val) => handlePasswordChange("confirmPassword", val)}
              />
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
