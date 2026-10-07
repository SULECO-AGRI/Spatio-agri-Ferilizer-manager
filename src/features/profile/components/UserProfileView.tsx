import { useState, useEffect } from "react";
import { KeyRound, ShieldCheck } from "lucide-react";
import { PageHeader, FormField } from "@/components/common";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

const permissionsList = [
  "Read Telemetry",
  "Deploy Missions",
  "Approve Invoices",
  "Create Reports",
  "Manage Users",
  "Configure System",
];

const sinhalaPermissions: Record<string, string> = {
  "Read Telemetry": "ටෙලිමෙට්‍රි දත්ත කියවීම",
  "Deploy Missions": "මෙහෙයුම් දියත් කිරීම",
  "Approve Invoices": "ඉන්වොයිස් අනුමත කිරීම",
  "Create Reports": "වාර්තා සැකසීම",
  "Manage Users": "පරිශීලකයන් කළමනාකරණය",
  "Configure System": "පද්ධතිය වින්‍යාස කිරීම",
};

export function UserProfileView() {
  const { user } = useAuth();
  const { dict, isSinhala } = useLanguage();

  const [profileData, setProfileData] = useState({
    name: user
      ? `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        (user as any).fullName ||
        "Administrator"
      : "Administrator",
    email: user?.email || "",
    phone: user?.mobile || "",
    department: user?.role || user?.profile?.department || "Operations Manager",
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name:
          `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
          (user as any).fullName ||
          "Administrator",
        email: user.email || "",
        phone: user.mobile || "",
        department: user.role || user.profile?.department || "Operations Manager",
      });
    }
  }, [user]);

  const initials = user
    ? `${user.firstName?.[0] || "A"}${user.lastName?.[0] || "D"}`.toUpperCase()
    : "AD";

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
    <div className={`space-y-6 font-sans ${isSinhala ? "font-sinhala" : ""}`}>
      {/* Title Header */}
      <PageHeader
        title={dict.admin.profile.title || (isSinhala ? "පරිශීලක පැතිකඩ" : "User Profile")}
        description={
          dict.admin.profile.description ||
          (isSinhala
            ? "ඔබේ පුද්ගලික ගිණුම් සැකසීම්, අවසර සහ අක්තපත්‍ර කළමනාකරණය කරන්න"
            : "Manage your personal account settings, role permissions, and credentials")
        }
      />

      {/* Profile Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Profile Info & Permissions (2/3 width on large screen) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Profile Information */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
            <h3 className="text-xl font-normal text-slate-900 font-display">
              {isSinhala ? "පුද්ගලික තොරතුරු" : "Personal Information"}
            </h3>

            {/* Avatar block with initials */}
            <div className="flex items-center gap-4 pb-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 text-lg font-medium flex items-center justify-center shadow-xs select-none">
                {initials}
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-slate-700 leading-none">
                  {isSinhala ? "පැතිකඩ පින්තූරය" : "Profile Picture"}
                </h4>
                <p className="text-[10px] text-slate-400 font-normal">
                  {isSinhala
                    ? "සක්‍රීය ගිණුමේ අක්තපත්‍ර අනුව ජනනය කරන ලද මුලකුරු"
                    : "Initial icon generated from active account credentials"}
                </p>
              </div>
            </div>

            {/* Form grid - Person name kept raw */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label={isSinhala ? "සම්පූර්ණ නම" : "Full Name"}
                value={profileData.name}
                onChange={(val) => handleProfileChange("name", val)}
              />

              <FormField
                label={isSinhala ? "විද්‍යුත් තැපැල් ලිපිනය" : "Email Address"}
                type="email"
                value={profileData.email}
                onChange={(val) => handleProfileChange("email", val)}
              />

              <FormField
                label={isSinhala ? "දුරකථන අංකය" : "Phone Number"}
                value={profileData.phone}
                onChange={(val) => handleProfileChange("phone", val)}
              />

              <FormField
                label={isSinhala ? "තනතුර / කාර්යභාරය" : "Role / Position"}
                value={profileData.department}
                disabled
              />
            </div>

            <button className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-normal transition-colors cursor-pointer block">
              {isSinhala ? "වෙනස්කම් සුරකින්න" : "Save Changes"}
            </button>
          </div>

          {/* Card 2: Role Permissions */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <h3 className="text-xl font-normal text-slate-900 font-display">
                {isSinhala ? "බලයලත් විෂයපථ සහ අවසර" : "Authorized Scopes & Permissions"}
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-normal max-w-xl leading-relaxed">
              {isSinhala ? (
                <>
                  ඔබගේ ගිණුමට <strong>Operations Manager</strong> පද්ධති කාර්යභාරය පවරා ඇත. පහත ප්‍රතිපත්ති මගින් ඔබට පරිපාලක පුවරුව තුළ කළ හැකි ක්‍රියා තීරණය වේ:
                </>
              ) : (
                <>
                  Your account is assigned the <strong>Operations Manager</strong> system role. The
                  following policy tags determine what actions you can execute inside the Fertilizer
                  manager admin dashboard:
                </>
              )}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {permissionsList.map((perm) => (
                <span
                  key={perm}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-xs font-normal"
                >
                  {isSinhala && sinhalaPermissions[perm] ? sinhalaPermissions[perm] : perm}
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
              <h3 className="text-xl font-normal text-slate-900 font-display">
                {isSinhala ? "මුරපදය වෙනස් කිරීම" : "Change Password"}
              </h3>
            </div>

            <div className="space-y-4">
              <FormField
                label={isSinhala ? "වත්මන් මුරපදය" : "Current Password"}
                type="password"
                value={passwordData.currentPassword}
                onChange={(val) => handlePasswordChange("currentPassword", val)}
              />

              <FormField
                label={isSinhala ? "නව මුරපදය" : "New Password"}
                type="password"
                value={passwordData.newPassword}
                onChange={(val) => handlePasswordChange("newPassword", val)}
              />

              <FormField
                label={isSinhala ? "නව මුරපදය තහවුරු කරන්න" : "Confirm New Password"}
                type="password"
                value={passwordData.confirmPassword}
                onChange={(val) => handlePasswordChange("confirmPassword", val)}
              />
            </div>

            <button className="w-full px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-normal transition-colors cursor-pointer block text-center">
              {isSinhala ? "මුරපදය යාවත්කාලීන කරන්න" : "Update Password"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfileView;
