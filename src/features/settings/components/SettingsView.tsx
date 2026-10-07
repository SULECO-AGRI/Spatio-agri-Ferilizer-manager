import { useState } from "react";
import { PageHeader, FormField, LanguageSwitcher } from "@/components/common";
import { useLanguage } from "@/context/LanguageContext";

const settingsTabs = [
  "Organization Settings",
  "Service Types",
  "Chemical Catalog",
  "Mission Templates",
  "User Roles",
  "Permissions",
  "Notification Settings",
];

const sinhalaSettingsTabs: Record<string, string> = {
  "Organization Settings": "ආයතනික සැකසුම්",
  "Service Types": "සේවා වර්ග",
  "Chemical Catalog": "රසායනික නාමාවලිය",
  "Mission Templates": "මෙහෙයුම් ආකෘති",
  "User Roles": "පරිශීලක කාර්යභාරයන්",
  "Permissions": "අවසර",
  "Notification Settings": "දැනුම්දීම් සැකසුම්",
};

export function SettingsView() {
  const [activeTab, setActiveTab] = useState("Organization Settings");
  const { dict, isSinhala } = useLanguage();
  const [formData, setFormData] = useState({
    orgName: "Fertilizer manager Operations",
    contactEmail: "ops@spatioagri.com",
    phoneNumber: "+94 77 123 4567",
    address: "123, Galle Road, Colombo 03, Sri Lanka",
    serviceRegion: "North & North Central Province",
    timeZone: "UTC+05:30 (Asia/Colombo)",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className={`space-y-6 font-sans ${isSinhala ? "font-sinhala" : ""}`}>
      {/* Title Header */}
      <PageHeader
        title={dict.admin.settings.title}
        description={dict.admin.settings.description}
      />

      {/* Main Settings Panel: 2 Columns */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Tabs Stack */}
        <div className="w-full lg:w-64 shrink-0 flex flex-col gap-1.5">
          {settingsTabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-normal transition-colors cursor-pointer block ${
                  isActive
                    ? "bg-[#1e293b] text-white"
                    : "bg-transparent hover:bg-slate-100 text-slate-500 hover:text-slate-700"
                }`}
              >
                {isSinhala && sinhalaSettingsTabs[tab] ? sinhalaSettingsTabs[tab] : tab}
              </button>
            );
          })}
        </div>

        {/* Right Settings Form Container */}
        <div className="flex-1 bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-xs w-full">
          {activeTab === "Organization Settings" ? (
            <div className="space-y-6">
              <h3 className="text-xl font-normal text-slate-900 font-display">
                {isSinhala ? "ආයතනික සැකසුම්" : "Organization Settings"}
              </h3>

              {/* Logo Upload Block */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-slate-50 border border-slate-200 border-dashed rounded-xl flex flex-col items-center justify-center text-slate-300">
                  <span className="text-[10px] text-slate-400 font-normal">
                    {isSinhala ? "ලාංඡනය" : "Logo"}
                  </span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-medium text-slate-600">
                    {isSinhala ? "ආයතන ලාංඡනය" : "Organization Logo"}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-normal">
                    {isSinhala ? "සමචතුරස්‍ර PNG එකක් එක් කරන්න, අවම 256×256" : "Upload square PNG, min 256×256"}
                  </p>
                </div>
              </div>

              {/* Fields Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Column 1 Inputs */}
                <div className="space-y-4">
                  <FormField
                    label={isSinhala ? "ආයතනයේ නම" : "Organization Name"}
                    value={formData.orgName}
                    onChange={(val) => handleInputChange("orgName", val)}
                  />

                  <FormField
                    label={isSinhala ? "දුරකථන අංකය" : "Phone Number"}
                    value={formData.phoneNumber}
                    onChange={(val) => handleInputChange("phoneNumber", val)}
                  />

                  <FormField
                    label={isSinhala ? "සේවා කලාපය" : "Service Region"}
                    value={formData.serviceRegion}
                    onChange={(val) => handleInputChange("serviceRegion", val)}
                  />
                </div>

                {/* Column 2 Inputs */}
                <div className="space-y-4">
                  <FormField
                    label={isSinhala ? "සම්බන්ධතා විද්‍යුත් තැපෑල" : "Contact Email"}
                    type="email"
                    value={formData.contactEmail}
                    onChange={(val) => handleInputChange("contactEmail", val)}
                  />

                  {/* Address and place name kept raw */}
                  <FormField
                    label={isSinhala ? "ලිපිනය" : "Address"}
                    value={formData.address}
                    onChange={(val) => handleInputChange("address", val)}
                  />

                  <FormField
                    label={isSinhala ? "වේලා කලාපය" : "Time Zone"}
                    value={formData.timeZone}
                    onChange={(val) => handleInputChange("timeZone", val)}
                  />
                </div>
              </div>

              {/* Language Preference Section */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-semibold text-slate-800">
                    {dict.admin.settings.languageSetting}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {dict.admin.settings.languageHelp}
                  </p>
                </div>
                <LanguageSwitcher variant="light" />
              </div>

              {/* Save Button */}
              <button className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer mt-4">
                {dict.admin.settings.saveChanges}
              </button>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 font-normal">
              {isSinhala
                ? `${sinhalaSettingsTabs[activeTab] || activeTab} පැනලය සැකසෙමින් පවතී.`
                : `${activeTab} panel is under configuration.`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SettingsView;
