import React, { useState, useEffect } from "react";
import {
  Percent,
  Coins,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  DollarSign,
  TrendingUp,
  Layers,
} from "lucide-react";
import { useSettings } from "../hooks/useSettings";
import { useLanguage } from "@/context/LanguageContext";

export function PricingSettingsTab() {
  const { settings, isLoading, updateSettings, isUpdating } = useSettings();
  const { isSinhala } = useLanguage();

  const [pilotPct, setPilotPct] = useState<number>(70);
  const [costPerHa, setCostPerHa] = useState<number>(6200);
  const [minDispatchFee, setMinDispatchFee] = useState<number>(3500);
  const [simMissionCost, setSimMissionCost] = useState<number>(10000);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync state when settings are loaded or updated
  useEffect(() => {
    if (settings) {
      if (settings.pilotCommissionPercentage !== undefined) {
        setPilotPct(settings.pilotCommissionPercentage);
      }
      if (settings.costPerHectare !== undefined) {
        setCostPerHa(settings.costPerHectare);
      }
      if (settings.minimumDispatchFee !== undefined) {
        setMinDispatchFee(settings.minimumDispatchFee);
      }
    }
  }, [settings]);

  // Derived calculations
  const platformPct = Math.max(0, 100 - pilotPct);
  const simPilotPayout = Math.round((simMissionCost * pilotPct) / 100);
  const simPlatformCut = simMissionCost - simPilotPayout;
  const costPerAcre = Math.round(costPerHa / 2.47105);

  const handleSave = async () => {
    setErrorMessage(null);
    setSaveSuccess(false);

    if (pilotPct < 0 || pilotPct > 100) {
      setErrorMessage(
        isSinhala
          ? "නියමු ප්‍රතිශතය 0% සහ 100% අතර විය යුතුය."
          : "Pilot percentage must be between 0% and 100%."
      );
      return;
    }

    if (costPerHa <= 0) {
      setErrorMessage(
        isSinhala
          ? "හෙක්ටයාරයක පිරිවැය 0 ට වඩා වැඩි විය යුතුය."
          : "Cost per hectare must be greater than 0 LKR."
      );
      return;
    }

    try {
      await updateSettings({
        pilotCommissionPercentage: Number(pilotPct),
        costPerHectare: Number(costPerHa),
        minimumDispatchFee: Number(minDispatchFee),
        operationRates: {
          FERTILIZING: Number(costPerHa),
          PRECISION_SPRAYING: Math.round(Number(costPerHa) * 1.12),
          PEST_CONTROL_SPRAY: Math.round(Number(costPerHa) * 1.2),
          SEED_BROADCASTING: Math.round(Number(costPerHa) * 0.88),
          DRONE_MAPPING: Math.round(Number(costPerHa) * 1.52),
        },
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setErrorMessage(
        err?.message ||
          (isSinhala
            ? "සැකසුම් සුරැකීමට නොහැකි විය. කරුණාකර නැවත උත්සාහ කරන්න."
            : "Failed to save settings. Please try again.")
      );
    }
  };

  const handleResetDefaults = () => {
    setPilotPct(70);
    setCostPerHa(6200);
    setMinDispatchFee(3500);
    setErrorMessage(null);
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-500">
          {isSinhala ? "මිල සහ නියමු ප්‍රතිශත සැකසුම් පූරණය වෙමින් පවතී..." : "Loading pricing & pilot commission configuration..."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Tab Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-6 md:p-8 text-white shadow-md border border-slate-700/50">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-medium mb-3 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isSinhala ? "පද්ධති මූල්‍ය හා ප්‍රතිශත පාලනය" : "System Pricing & Commission Control"}</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-2 font-display">
            {isSinhala ? "මිල නියම කිරීම සහ නියමු කොමිස් සැකසුම්" : "Dynamic Pricing & Pilot Payout Rates"}
          </h2>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            {isSinhala
              ? "මෙම සැකසුම් පරිපාලක විසින් ඕනෑම වේලාවක වෙනස් කළ හැක. සියලුම නව සේවා ඉල්ලීම් සහ නියමු මෙහෙයුම් සඳහා ගතිකව ක්‍රියාත්මක වේ."
              : "Control the dynamic percentage allocated to drone pilots and base pricing per hectare. Changes propagate immediately to all cost estimates and mission earnings."}
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-8 translate-y-8">
          <TrendingUp className="w-64 h-64 text-emerald-400" />
        </div>
      </div>

      {/* Notifications */}
      {saveSuccess && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs shadow-xs animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="flex-1">
            <span className="font-semibold">
              {isSinhala ? "සාර්ථකව යාවත්කාලීන විය!" : "Settings Saved Successfully!"}
            </span>{" "}
            {isSinhala
              ? "නව නියමු ප්‍රතිශතය සහ හෙක්ටයාරයක පිරිවැය පද්ධතිය පුරා සක්‍රිය කරන ලදී."
              : "Pilot commission rate and cost per hectare are now actively applied across all cost estimators and mission payouts."}
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs shadow-xs animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <div className="flex-1 font-medium">{errorMessage}</div>
        </div>
      )}

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Form Controls */}
        <div className="space-y-6">
          {/* Card 1: Pilot Commission Percentage */}
          <div className="bg-slate-50/70 border border-slate-200/90 rounded-2xl p-6 space-y-5 hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100/80 flex items-center justify-center text-emerald-700">
                  <Percent className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {isSinhala ? "නියමු ගෙවීම් ප්‍රතිශතය" : "Pilot Payout Percentage"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {isSinhala ? "මෙහෙයුමකින් නියමුවාට හිමිවන ප්‍රතිශතය" : "Share of mission earnings allocated to pilot"}
                  </p>
                </div>
              </div>
              <div className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-xs">
                {pilotPct}%
              </div>
            </div>

            {/* Slider & Input */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="font-medium">{isSinhala ? "ප්‍රතිශතය තෝරන්න (0% - 100%)" : "Adjust Split Percentage"}</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={pilotPct}
                    onChange={(e) => setPilotPct(Math.min(100, Math.max(0, Number(e.target.value) || 0)))}
                    className="w-20 px-2.5 py-1 text-center font-bold text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-xs font-semibold text-slate-500">%</span>
                </div>
              </div>

              <input
                type="range"
                min="10"
                max="95"
                step="1"
                value={pilotPct}
                onChange={(e) => setPilotPct(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />

              <div className="flex justify-between text-[10px] text-slate-400 font-medium px-1">
                <span>50%</span>
                <span>60%</span>
                <span className="text-emerald-700 font-bold">70% (Default)</span>
                <span>80%</span>
                <span>90%</span>
              </div>
            </div>

            {/* Quick split pill summary */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                <div className="text-[10px] text-slate-400 uppercase font-medium">
                  {isSinhala ? "නියමුවාගේ කොටස" : "Pilot Share"}
                </div>
                <div className="text-base font-bold text-emerald-600 mt-0.5">{pilotPct}%</div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {isSinhala ? "නියමු මුදල් පසුම්බියට" : "Credited to pilot wallet"}
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                <div className="text-[10px] text-slate-400 uppercase font-medium">
                  {isSinhala ? "වේදිකා ගාස්තුව" : "Platform Retained"}
                </div>
                <div className="text-base font-bold text-slate-700 mt-0.5">{platformPct}%</div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {isSinhala ? "ආයතන මෙහෙයුම් ලාභය" : "Company operating cut"}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Cost Per Hectare */}
          <div className="bg-slate-50/70 border border-slate-200/90 rounded-2xl p-6 space-y-5 hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100/80 flex items-center justify-center text-blue-700">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {isSinhala ? "හෙක්ටයාරයක මූලික පිරිවැය" : "Base Cost Per Hectare"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {isSinhala ? "ගොවීන්ගෙන් අයකරන මූලික මිණුම් අනුපාතය" : "Standard benchmark spraying rate in LKR / Ha"}
                  </p>
                </div>
              </div>
              <div className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-xs">
                LKR {costPerHa.toLocaleString()}
              </div>
            </div>

            {/* Input field */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-medium text-slate-600 flex items-center justify-between">
                <span>{isSinhala ? "හෙක්ටයාරයක අනුපාතය (LKR / Ha)" : "Rate per Hectare (LKR)"}</span>
                <span className="text-[11px] text-slate-400">
                  ≈ LKR {costPerAcre.toLocaleString()} / {isSinhala ? "අක්කරය" : "acre"}
                </span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                  LKR
                </span>
                <input
                  type="number"
                  min="500"
                  step="100"
                  value={costPerHa}
                  onChange={(e) => setCostPerHa(Number(e.target.value) || 0)}
                  className="w-full pl-12 pr-4 py-2.5 text-sm font-semibold bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="e.g. 6200"
                />
              </div>
            </div>

            {/* Minimum Mobilization Fee */}
            <div className="space-y-2 pt-2 border-t border-slate-200/60">
              <label className="text-xs font-medium text-slate-600 flex items-center justify-between">
                <span>{isSinhala ? "අවම පිටත්කිරීමේ ගාස්තුව (LKR)" : "Minimum Dispatch Setup Fee (LKR)"}</span>
                <span className="text-[11px] text-slate-400">
                  {isSinhala ? "කුඩා ඉඩම් සඳහා අවම අගය" : "Guaranteed base floor"}
                </span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                  LKR
                </span>
                <input
                  type="number"
                  min="1000"
                  step="100"
                  value={minDispatchFee}
                  onChange={(e) => setMinDispatchFee(Number(e.target.value) || 0)}
                  className="w-full pl-12 pr-4 py-2.5 text-sm font-semibold bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="e.g. 3500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Simulator & Operation Breakdown */}
        <div className="space-y-6">
          {/* Card 3: Interactive Split Calculator */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    {isSinhala ? "සජීවී ආදායම් බෙදීමේ අනුකරණය" : "Live Split Simulator"}
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    {isSinhala ? "මෙහෙයුම් පිරිවැය අනුව ලැබෙන කොටස් පරීක්ෂා කරන්න" : "Test how a mission fee splits with current settings"}
                  </p>
                </div>
              </div>
            </div>

            {/* Test Amount Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">
                {isSinhala ? "අනුකරණය කළ මෙහෙයුම් මුදල (LKR)" : "Sample Mission Invoiced Amount (LKR)"}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="500"
                  min="1000"
                  value={simMissionCost}
                  onChange={(e) => setSimMissionCost(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-3.5 py-2 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setSimMissionCost(10000)}
                  className="px-3 py-2 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors cursor-pointer shrink-0"
                >
                  10k
                </button>
                <button
                  type="button"
                  onClick={() => setSimMissionCost(25000)}
                  className="px-3 py-2 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors cursor-pointer shrink-0"
                >
                  25k
                </button>
              </div>
            </div>

            {/* Split Progress Bar */}
            <div className="space-y-2 pt-1">
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                <div
                  style={{ width: `${pilotPct}%` }}
                  className="bg-emerald-500 transition-all duration-300 flex items-center justify-center text-[9px] font-bold text-white"
                />
                <div
                  style={{ width: `${platformPct}%` }}
                  className="bg-slate-700 transition-all duration-300 flex items-center justify-center text-[9px] font-bold text-white"
                />
              </div>
              <div className="flex justify-between text-[11px] font-medium">
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  {isSinhala ? `නියමුවා: LKR ${simPilotPayout.toLocaleString()}` : `Pilot: LKR ${simPilotPayout.toLocaleString()}`} ({pilotPct}%)
                </span>
                <span className="text-slate-600 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-slate-700 inline-block" />
                  {isSinhala ? `ආයතනය: LKR ${simPlatformCut.toLocaleString()}` : `Platform: LKR ${simPlatformCut.toLocaleString()}`} ({platformPct}%)
                </span>
              </div>
            </div>

            {/* Visual Callout */}
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-[11px] text-emerald-900 leading-relaxed">
              💡 {isSinhala
                ? `වර්තමාන සැකසුම් අනුව, සෑම LKR ${simMissionCost.toLocaleString()} ක මෙහෙයුමකින් නියමුවාට LKR ${simPilotPayout.toLocaleString()} ක් හිමිවන අතර සමාගමට LKR ${simPlatformCut.toLocaleString()} ක් රඳවා ගැනේ.`
                : `With these settings, every LKR ${simMissionCost.toLocaleString()} job yields LKR ${simPilotPayout.toLocaleString()} for the pilot and retains LKR ${simPlatformCut.toLocaleString()} for company ops.`}
            </div>
          </div>

          {/* Card 4: Operation Rate Breakdown Preview */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>{isSinhala ? "මෙහෙයුම් අනුව ගණනය වන මිල ගණන්" : "Operation Rates Auto-Calculated"}</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-medium text-slate-700">🌱 Fertilizer Spraying (Standard)</span>
                <span className="font-bold text-slate-900">LKR {costPerHa.toLocaleString()} / Ha</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-medium text-slate-700">🎯 Precision Droplet Spraying</span>
                <span className="font-bold text-slate-900">LKR {Math.round(costPerHa * 1.12).toLocaleString()} / Ha</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-medium text-slate-700">🐛 Pest & Disease Control</span>
                <span className="font-bold text-slate-900">LKR {Math.round(costPerHa * 1.2).toLocaleString()} / Ha</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-medium text-slate-700">🌾 Seed Broadcasting</span>
                <span className="font-bold text-slate-900">LKR {Math.round(costPerHa * 0.88).toLocaleString()} / Ha</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-medium text-slate-700">🛰️ Multispectral Drone Mapping</span>
                <span className="font-bold text-slate-900">LKR {Math.round(costPerHa * 1.52).toLocaleString()} / Ha</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer Buttons */}
      <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleResetDefaults}
          disabled={isUpdating}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer w-full sm:w-auto justify-center"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{isSinhala ? "පෙරනිමි අගයන්ට සකසන්න" : "Reset to Defaults (70% / LKR 6,200)"}</span>
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={isUpdating}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm hover:shadow transition-all cursor-pointer w-full sm:w-auto justify-center disabled:opacity-50"
        >
          {isUpdating ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>{isSinhala ? "සුරැකෙමින් පවතී..." : "Saving Changes..."}</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{isSinhala ? "වෙනස්කම් සුරකින්න" : "Save Pricing & Commission"}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
export default PricingSettingsTab;
