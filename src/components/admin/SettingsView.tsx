import { useState } from "react";

const settingsTabs = [
  "Organization Settings",
  "Drone Types",
  "Chemical Catalog",
  "Mission Templates",
  "User Roles",
  "Permissions",
  "Notification Settings"
];

export function SettingsView() {
  const [activeTab, setActiveTab] = useState("Organization Settings");
  const [formData, setFormData] = useState({
    orgName: "SpatioAgri Operations",
    contactEmail: "ops@spatioagri.com",
    phoneNumber: "+94 77 123 4567",
    address: "123, Galle Road, Colombo 03, Sri Lanka",
    serviceRegion: "North & North Central Province",
    timeZone: "UTC+05:30 (Asia/Colombo)"
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-medium tracking-tight text-slate-900 font-display">
          Settings
        </h1>
        <p className="text-slate-400 text-xs md:text-sm mt-1 font-normal">
          Organization configuration, catalogs and access control
        </p>
      </div>

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
                {tab}
              </button>
            );
          })}
        </div>

        {/* Right Settings Form Container */}
        <div className="flex-1 bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-xs w-full">
          {activeTab === "Organization Settings" ? (
            <div className="space-y-6">
              <h3 className="text-xl font-normal text-slate-900 font-display">
                Organization Settings
              </h3>

              {/* Logo Upload Block */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-slate-50 border border-slate-200 border-dashed rounded-xl flex flex-col items-center justify-center text-slate-300">
                  <span className="text-[10px] text-slate-400 font-normal">Logo</span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-medium text-slate-600">
                    Organization Logo
                  </h4>
                  <p className="text-[10px] text-slate-400 font-normal">
                    Upload square PNG, min 256×256
                  </p>
                </div>
              </div>

              {/* Fields Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Column 1 Inputs */}
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-500 font-normal block mb-1.5">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      value={formData.orgName}
                      onChange={(e) => handleInputChange("orgName", e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-white focus:outline-none focus:border-slate-450 text-slate-800 font-normal"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 font-normal block mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-white focus:outline-none focus:border-slate-450 text-slate-800 font-normal"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 font-normal block mb-1.5">
                      Service Region
                    </label>
                    <input
                      type="text"
                      value={formData.serviceRegion}
                      onChange={(e) => handleInputChange("serviceRegion", e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-white focus:outline-none focus:border-slate-450 text-slate-800 font-normal"
                    />
                  </div>
                </div>

                {/* Column 2 Inputs */}
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-500 font-normal block mb-1.5">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-white focus:outline-none focus:border-slate-450 text-slate-800 font-normal"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 font-normal block mb-1.5">
                      Address
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-white focus:outline-none focus:border-slate-450 text-slate-800 font-normal"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 font-normal block mb-1.5">
                      Time Zone
                    </label>
                    <input
                      type="text"
                      value={formData.timeZone}
                      onChange={(e) => handleInputChange("timeZone", e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-white focus:outline-none focus:border-slate-450 text-slate-800 font-normal"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <button className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 border border-slate-300 rounded-lg text-xs font-normal transition-colors cursor-pointer mt-4">
                Save Changes
              </button>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 font-normal">
              {activeTab} panel is under configuration.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
