import { useMemo } from "react";
import {
  Star,
  RefreshCw,
  Download,
  FileSpreadsheet,
  Clock,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Search,
  AlertCircle,
} from "lucide-react";
import { PageHeader, MetricCard, RefreshButton, StatusBadge } from "@/components/common";
import { BarChart, LineChart } from "@/components/charts";
import { useReportsAnalytics } from "../hooks/useReportsAnalytics";
import { useLanguage } from "@/context/LanguageContext";

function formatNum(val: unknown, fallback = "0"): string {
  if (typeof val === "number" && !isNaN(val)) {
    return val.toLocaleString();
  }
  if (typeof val === "string" && val.trim() !== "") {
    return val;
  }
  return fallback;
}

function formatRating(val: unknown, fallback = "5.00"): string {
  if (typeof val === "number" && !isNaN(val)) {
    return val.toFixed(2);
  }
  if (typeof val === "string" && !isNaN(Number(val))) {
    return Number(val).toFixed(2);
  }
  return fallback;
}

export function ReportsView() {
  const { dict, isSinhala } = useLanguage();
  const {
    summary,
    completedMissions,
    revenue,
    pilotPerformance,
    farmerGrowth,
    pilots = [],
    pagination,
    page,
    setPage,
    limit,
    setLimit,
    sortBy,
    handleSort,
    searchQuery,
    setSearchQuery,
    isLoading,
    isTableLoading,
    isFetching,
    isError,
    error,
    lastUpdated,
    refetch,
    exportToCSV,
  } = useReportsAnalytics();

  // Dynamic Bar Chart data mapped from completed missions
  const barChartData = useMemo(() => {
    const thisMonthVal =
      completedMissions?.completedThisMonth ?? summary?.completedMissions?.value ?? 0;
    const lastMonthVal = completedMissions?.completedLastMonth ?? 0;

    return [
      { label: "M-3", value: 0 },
      { label: "M-2", value: 0 },
      { label: isSinhala ? "පසුගිය මස" : "Last Month", value: lastMonthVal },
      { label: isSinhala ? "මෙම මස" : "This Month", value: thisMonthVal },
    ];
  }, [completedMissions, summary, isSinhala]);

  // Dynamic Line Chart points mapped from revenue analytics
  const lineChartPoints = useMemo(() => {
    const totalRev = Number(revenue?.totalRevenue || summary?.revenue?.value || 0);
    const revThisMonth = Number(
      revenue?.revenueThisMonth || summary?.revenue?.revenueThisMonth || 0,
    );
    const revLastMonth = Number(revenue?.revenueLastMonth || 0);

    const maxRev = Math.max(totalRev, revThisMonth, revLastMonth, 1000);
    const getY = (val: number) => Math.round(135 - (val / maxRev) * 100);

    return [
      { label: "M-3", x: 60, y: getY(0) },
      { label: "M-2", x: 180, y: getY(0) },
      { label: isSinhala ? "පෙර මස" : "Last Mo", x: 300, y: getY(revLastMonth) },
      { label: isSinhala ? "මෙම මස" : "This Mo", x: 420, y: getY(revThisMonth || totalRev) },
    ];
  }, [revenue, summary, isSinhala]);

  const currencyStr = revenue?.currency || summary?.revenue?.currency || "LKR";
  const revenueTotalVal =
    summary?.revenue?.formatted ||
    (revenue ? `${currencyStr} ${formatNum(revenue.totalRevenue)}` : "LKR 0");
  const revenueThisMonthVal = formatNum(
    summary?.revenue?.revenueThisMonth ?? revenue?.revenueThisMonth ?? 0,
  );
  const missionsCountVal =
    summary?.completedMissions?.formatted ||
    formatNum(completedMissions?.totalCompletedMissions, "0");

  return (
    <div className={`space-y-6 md:space-y-8 font-sans animate-in fade-in duration-300 ${isSinhala ? "font-sinhala" : ""}`}>
      {/* Header Info & Sync Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title={dict.admin.reports.title || (isSinhala ? "වාර්තා සහ විශ්ලේෂණ" : "Reports & Analytics")}
          description={dict.admin.reports.description || (isSinhala ? "තත්‍ය කාලීන මෙහෙයුම් ටෙලිමෙට්‍රි, ආදායම් බුද්ධිය, ගුවන් යානා සූදානම සහ පාරිභෝගික වර්ධනය." : "Real-time operational telemetry, revenue intelligence, fleet readiness, and customer growth.")}
        />

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-mono hidden md:inline-block">
            {isSinhala ? "යාවත්කාලීනයි: " : "Updated: "}
            {lastUpdated ? lastUpdated.toLocaleTimeString() : (isSinhala ? "දැන්" : "Just now")}
          </span>
          <RefreshButton
            onRefresh={() => refetch()}
            isLoading={isLoading || isTableLoading}
            isFetching={isFetching}
            label={isSinhala ? "සජීවී දත්ත සමමුහුර්ත කරන්න" : "Sync Live Data"}
            title={isSinhala ? "සජීවී විශ්ලේෂණ දත්ත යාවත්කාලීන කරන්න" : "Refresh live analytics data"}
          />
        </div>
      </div>

      {isError && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            {isSinhala
              ? "දැනුම්දීම: සජීවී විශ්ලේෂණ තාවකාලිකව විකල්ප ආකාරයෙන් ක්‍රියාත්මක වේ."
              : `Notice: ${error || "Live analytics temporarily operating in fallback mode."}`}
          </span>
        </div>
      )}

      {/* 1. Main 4 KPI Summary Cards (from /api/admin/analytics/summary) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* Completed Missions Card */}
        <MetricCard
          title={isSinhala ? "සම්පූර්ණ කළ මෙහෙයුම්" : "Completed Missions"}
          value={isLoading ? "..." : missionsCountVal}
          footer={
            isSinhala
              ? `අද: ${summary?.completedMissions?.completedToday ?? completedMissions?.completedToday ?? 0} | මෙම මස: ${summary?.completedMissions?.completedThisMonth ?? completedMissions?.completedThisMonth ?? 0}`
              : `Today: ${summary?.completedMissions?.completedToday ?? completedMissions?.completedToday ?? 0} | Month: ${summary?.completedMissions?.completedThisMonth ?? completedMissions?.completedThisMonth ?? 0}`
          }
          trend={{
            value: `+${summary?.completedMissions?.growthPercentage ?? completedMissions?.monthOverMonthGrowthPercentage ?? 0}% ${isSinhala ? "මාසික" : "MoM"}`,
            isPositive: (summary?.completedMissions?.growthPercentage ?? 0) >= 0,
          }}
        />

        {/* Total Revenue Card */}
        <MetricCard
          title={isSinhala ? "මුළු ආදායම" : "Total Revenue"}
          value={isLoading ? "..." : revenueTotalVal}
          footer={
            isSinhala
              ? `මෙම මස: ${currencyStr} ${revenueThisMonthVal}`
              : `This Month: ${currencyStr} ${revenueThisMonthVal}`
          }
          trend={{
            value: `+${summary?.revenue?.growthPercentage ?? revenue?.monthOverMonthGrowthPercentage ?? 0}% ${isSinhala ? "පෙර මසට සාපේක්ෂව" : "vs last mo"}`,
            isPositive: (summary?.revenue?.growthPercentage ?? 0) >= 0,
          }}
        />

        {/* Pilot Fleet Performance Card */}
        <MetricCard
          title={isSinhala ? "නියමු කාර්යසාධනය" : "Pilot Performance"}
          value={
            isLoading
              ? "..."
              : summary?.pilotPerformance?.formatted ||
                `${pilotPerformance?.fleetAverageRating || 5.0} ${isSinhala ? "සාමාන්‍ය" : "avg"}`
          }
          footer={
            isSinhala
              ? `සක්‍රීය ${summary?.pilotPerformance?.activePilots ?? pilotPerformance?.activePilots ?? 0} / මුළු ${summary?.pilotPerformance?.totalPilots ?? pilotPerformance?.totalPilots ?? 0} නියමුවන්`
              : `${summary?.pilotPerformance?.activePilots ?? pilotPerformance?.activePilots ?? 0} active / ${summary?.pilotPerformance?.totalPilots ?? pilotPerformance?.totalPilots ?? 0} pilots`
          }
          trend={{
            value: `${pilotPerformance?.totalFleetFlightHours ?? 0} ${isSinhala ? "පියාසර පැය" : "flight hrs"}`,
            isPositive: true,
          }}
        />

        {/* Farmer Growth Rate Card */}
        <MetricCard
          title={isSinhala ? "ගොවි වර්ධනය" : "Farmer Growth"}
          value={
            isLoading
              ? "..."
              : summary?.farmerGrowth?.formatted || `+${farmerGrowth?.growthPercentage ?? 100}%`
          }
          footer={
            isSinhala
              ? `මුළු: ${summary?.farmerGrowth?.totalFarmers ?? farmerGrowth?.totalFarmers ?? 0} ලියාපදිංචි`
              : `Total: ${summary?.farmerGrowth?.totalFarmers ?? farmerGrowth?.totalFarmers ?? 0} registered`
          }
          trend={{
            value: `+${summary?.farmerGrowth?.newFarmersThisMonth ?? farmerGrowth?.newFarmersThisMonth ?? 0} ${isSinhala ? "මෙම මස නව" : "new this mo"}`,
            isPositive: (summary?.farmerGrowth?.newFarmersThisMonth ?? 0) > 0,
          }}
        />
      </div>

      {/* 2. Operational Highlights Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Top Performer Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {isSinhala ? "ප්‍රමුඛතම නියමුවා" : "Top Fleet Pilot"}
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              {isSinhala ? "ප්‍රමුඛ" : "LEADER"}
            </span>
          </div>

          <div className="mt-3">
            {/* Person name preserved raw */}
            <h4 className="text-2xl font-bold font-display text-slate-900">
              {pilotPerformance?.topPerformingPilot?.fullName || (isSinhala ? "නියමු නායකයා" : "Fleet Leader")}
            </h4>
            <div className="flex items-center gap-2.5 mt-1 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1 text-amber-600 font-semibold font-mono">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {pilotPerformance?.topPerformingPilot?.ratings ?? "5.0"} {isSinhala ? "ඇගයුම" : "rating"}
              </span>
              <span>•</span>
              <span className="text-emerald-700 font-medium">
                {pilotPerformance?.topPerformingPilot?.completedMissions ?? 0} {isSinhala ? "මෙහෙයුම් සම්පූර්ණයි" : "missions completed"}
              </span>
            </div>
          </div>
        </div>

        {/* Mission Fulfillment Rate */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {isSinhala ? "මෙහෙයුම් සාර්ථකත්ව අනුපාතය" : "Mission Completion Rate"}
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 font-display">
              {completedMissions?.completionRatePercentage ?? 100}%
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {isSinhala
                ? `මුළු මෙහෙයුම් ${completedMissions?.totalCompletedMissions ?? summary?.completedMissions?.value ?? 0} ක කිසිදු පියාසර දෝෂයක් වාර්තා වී නොමැත.`
                : `Zero flight anomalies reported across ${completedMissions?.totalCompletedMissions ?? summary?.completedMissions?.value ?? 0} total missions.`}
            </p>
          </div>
        </div>

        {/* Agricultural Coverage */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {isSinhala ? "සක්‍රීය ක්ෂේත්‍ර ආවරණය" : "Active Field Coverage"}
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 font-display">
              {farmerGrowth?.totalFieldsRegistered ?? 0} {isSinhala ? "ලියාපදිංචි ක්ෂේත්‍ර" : "Registered Fields"}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {isSinhala
                ? `නිරවද්‍ය පොහොර බෙදාහැරීම් සිතියම් ලබා ගන්නා සක්‍රීය ගොවිපළවල් ${farmerGrowth?.activeFarmersWithFields ?? 0} කි.`
                : `${farmerGrowth?.activeFarmersWithFields ?? 0} active client farms receiving precision prescription maps.`}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Interactive Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Missions Completed Bar Chart */}
        <BarChart
          title={isSinhala ? "මාසික ප්‍රවණතා — සම්පූර්ණ කළ මෙහෙයුම්" : "Monthly Trends — Missions Completed"}
          data={barChartData}
        />

        {/* Revenue Trend SVG Line Chart */}
        <div className="relative">
          <LineChart
            title={isSinhala ? "ආදායම් සහ කොමිස් වර්ධනය" : "Revenue & Commission Growth"}
            points={lineChartPoints}
          />
          {/* Revenue split footer summary */}
          {revenue && (
            <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5">
                <span className="text-slate-400 block text-[10px] uppercase">
                  {isSinhala ? "සමාගම් කොමිස්" : "Company Commission"}
                </span>
                <span className="font-semibold text-slate-800 font-mono">
                  {currencyStr} {formatNum(revenue.companyCommission)}
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5">
                <span className="text-slate-400 block text-[10px] uppercase">
                  {isSinhala ? "නියමු ඉපැයීම්" : "Pilot Earnings"}
                </span>
                <span className="font-semibold text-emerald-700 font-mono">
                  {currencyStr} {formatNum(revenue.pilotEarnings)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Pilot Performance Table with Server-Side Sorting & Pagination */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-display">
              {isSinhala ? "නියමු කාර්යසාධන ශ්‍රේණිගත කිරීම" : "Pilot Performance Leaderboard"}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isSinhala
                ? "සජීවී පියාසර දත්ත, මෙහෙයුම් ගණන, පියාසර පැය සහ නියමු ඇගයුම්."
                : "Live flight telemetry, mission counts, flight hours, and operator ratings."}
            </p>
          </div>

          {/* Search & Limit Selector */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isSinhala ? "නියමුවාගේ නම සොයන්න..." : "Search pilot name..."}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500 w-44 md:w-56"
              />
            </div>

            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 cursor-pointer"
            >
              <option value={5}>5 / {isSinhala ? "පිටුවකට" : "page"}</option>
              <option value={10}>10 / {isSinhala ? "පිටුවකට" : "page"}</option>
              <option value={20}>20 / {isSinhala ? "පිටුවකට" : "page"}</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-xs font-medium">
                <th
                  onClick={() => handleSort("pilotName")}
                  className="pb-3 pl-2 cursor-pointer hover:text-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>{isSinhala ? "නියමුවා" : "Pilot Operator"}</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="pb-3">{isSinhala ? "තත්ත්වය" : "Status"}</th>
                <th
                  onClick={() => handleSort("completedMissions")}
                  className="pb-3 cursor-pointer hover:text-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>{isSinhala ? "මෙහෙයුම්" : "Missions"}</span>
                    <ArrowUpDown className="w-3 h-3 text-emerald-600" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("averageRatings")}
                  className="pb-3 cursor-pointer hover:text-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>{isSinhala ? "සාමාන්‍ය ඇගයුම" : "Avg Rating"}</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("flightHours")}
                  className="pb-3 cursor-pointer hover:text-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>{isSinhala ? "පියාසර පැය" : "Flight Hours"}</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="pb-3">{isSinhala ? "බලපත්‍රය" : "License"}</th>
                <th
                  onClick={() => handleSort("totalEarnings")}
                  className="pb-3 cursor-pointer hover:text-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>{isSinhala ? "ඉපැයීම්" : "Earnings"}</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/70 text-sm">
              {isTableLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-slate-400">
                    <RefreshCw className="w-4 h-4 animate-spin inline-block mr-2 text-emerald-500" />
                    {isSinhala ? "නියමු දත්ත පූරණය වෙමින්..." : "Loading pilot leaderboard..."}
                  </td>
                </tr>
              ) : pilots.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-slate-400">
                    {isSinhala ? "සෙවුමට ගැළපෙන නියමු වාර්තා හමු නොවීය." : "No pilot records found matching query."}
                  </td>
                </tr>
              ) : (
                pilots.map((p) => (
                  <tr key={p.pilotId} className="hover:bg-slate-50/40 transition-colors">
                    {/* Pilot Info - Person name kept raw */}
                    <td className="py-4 pl-2">
                      <div>
                        <span className="text-slate-900 font-medium block">{p.pilotName}</span>
                        <span className="text-xs text-slate-400 font-mono block">{p.email}</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4">
                      <StatusBadge status={p.status} />
                    </td>

                    {/* Missions count */}
                    <td className="py-4 text-slate-700 font-semibold font-mono">
                      {p.missions?.completedMissions ?? 0}
                    </td>

                    {/* Rating */}
                    <td className="py-4 text-slate-700">
                      <span className="inline-flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md text-amber-800 text-xs font-semibold border border-amber-200">
                        {formatRating(p.averageRatings)}
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      </span>
                    </td>

                    {/* Flight Hours */}
                    <td className="py-4 text-slate-600 font-mono text-xs">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {p.flightHours} {isSinhala ? "පැය" : "hrs"}
                      </span>
                    </td>

                    {/* License */}
                    <td className="py-4 text-slate-500 font-mono text-xs">
                      {p.licenceNumber || "DP-CAASL"}
                    </td>

                    {/* Earnings */}
                    <td className="py-4 text-slate-800 font-mono font-medium text-xs">
                      {currencyStr} {formatNum(p.totalEarnings)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
          <div>
            {isSinhala ? (
              <>
                ලියාපදිංචි නියමුවන් <span className="font-semibold text-slate-700">{pagination?.total ?? pilots.length}</span> න්{" "}
                <span className="font-semibold text-slate-700">{pilots.length}</span> ක් පෙන්වයි
              </>
            ) : (
              <>
                Showing <span className="font-semibold text-slate-700">{pilots.length}</span> of{" "}
                <span className="font-semibold text-slate-700">
                  {pagination?.total ?? pilots.length}
                </span>{" "}
                registered pilots
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage(page - 1)}
              disabled={!pagination?.hasPrevPage || isTableLoading}
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>{isSinhala ? "පෙර" : "Previous"}</span>
            </button>
            <span className="px-3 py-1 font-mono text-slate-700 bg-slate-100 rounded-md">
              {isSinhala
                ? `පිටුව ${pagination?.page ?? page} / ${pagination?.totalPages || 1}`
                : `Page ${pagination?.page ?? page} of ${pagination?.totalPages || 1}`}
            </span>
            <button
              type="button"
              onClick={() => setPage(page + 1)}
              disabled={!pagination?.hasNextPage || isTableLoading}
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <span>{isSinhala ? "මීළඟ" : "Next"}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. Bottom Download & Export Action Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200/80">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>
            {isSinhala
              ? "කළමනාකරණ වාර්තා සහ CAASL අනුකූලතාව සඳහා දත්ත එක්ස්පෝට් කරන්න."
              : "Export analytics dataset for management reports & CAASL compliance."}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={exportToCSV}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-medium shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isSinhala ? "CSV ලෙස ලබාගන්න" : "Export to CSV"}</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-white" />
            <span>{isSinhala ? "වාර්තාව මුද්‍රණය (PDF)" : "Print Report (PDF)"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReportsView;
