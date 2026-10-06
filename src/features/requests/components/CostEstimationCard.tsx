import { useState } from "react";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import type { CostEstimationBreakdown } from "@/types/request";

interface CostEstimationCardProps {
  estimation: CostEstimationBreakdown | null;
  isLoading?: boolean;
  isFetching?: boolean;
  className?: string;
  fieldAreaAcres?: number;
}

export function CostEstimationCard({
  estimation,
  isLoading = false,
  isFetching = false,
  className = "",
  fieldAreaAcres,
}: CostEstimationCardProps) {
  const [showFormulaDetails, setShowFormulaDetails] = useState<boolean>(false);

  if (isLoading && !estimation) {
    return (
      <div className={`p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 animate-pulse ${className}`}>
        <div className="flex items-center justify-between">
          <div className="h-4 w-28 bg-slate-200 rounded" />
          <div className="h-4 w-16 bg-slate-200 rounded" />
        </div>
        <div className="h-8 w-40 bg-slate-200 rounded-lg" />
        <div className="grid grid-cols-4 gap-2 pt-1">
          <div className="h-7 bg-slate-200 rounded" />
          <div className="h-7 bg-slate-200 rounded" />
          <div className="h-7 bg-slate-200 rounded" />
          <div className="h-7 bg-slate-200 rounded" />
        </div>
      </div>
    );
  }

  if (!estimation) {
    return (
      <div className={`p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-500 ${className}`}>
        <p className="font-medium text-slate-700">Cost Estimate</p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Select a field parcel to calculate real-time pricing breakdown.
        </p>
      </div>
    );
  }

  const currency = estimation.currency || "LKR";
  const formattedTotal = Number(estimation.totalEstimatedCost || 0).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const formattedBaseRate = Number(estimation.baseRatePerAcre || 0).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const formattedDiscount = Number(estimation.areaDiscountAmount || 0).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const hasDiscount = estimation.areaDiscountPercent > 0 && estimation.areaDiscountAmount > 0;

  return (
    <div
      className={`rounded-xl border transition-all duration-200 overflow-hidden font-sans ${
        estimation.isMinimumFeeApplied
          ? "bg-amber-50/30 border-amber-200"
          : "bg-slate-50/50 border-slate-200"
      } ${className}`}
    >
      {/* Primary Price & Overview */}
      <div className="p-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Cost Estimate
          </span>

          {isFetching && (
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full font-medium">
              <Loader2 className="w-2.5 h-2.5 animate-spin" /> Recalculating...
            </span>
          )}
        </div>

        {/* Hero Price Metric */}
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs font-semibold text-slate-500">{currency}</span>
            <span className="text-2xl font-bold font-mono text-slate-900 tracking-tight">
              {formattedTotal}
            </span>
          </div>

          <div className="text-right text-[11px] text-slate-500">
            <span>Base: {currency} {formattedBaseRate} / acre</span>
            <span className="text-slate-400 block text-[10px]">
              Calculated for {estimation.area || fieldAreaAcres || 0} acres
            </span>
          </div>
        </div>

        {/* Minimum Fee Notice Banner (if triggered) */}
        {estimation.isMinimumFeeApplied && (
          <div className="mt-2.5 p-2 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-800">
            <strong>Minimum fee applied:</strong> Baseline rate of {currency} {Number(estimation.minimumFee).toLocaleString()} for small parcel.
          </div>
        )}

        {/* Rate Modifiers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-200/60 text-xs">
          {/* Crop */}
          <div className="p-2 bg-white border border-slate-200/70 rounded-lg">
            <div className="text-[10px] text-slate-400">Crop Index</div>
            <div className="font-semibold text-slate-800 mt-0.5 text-[11px]">
              {estimation.cropMultiplier}x <span className="text-[10px] font-normal text-slate-400">({estimation.cropType || "Crop"})</span>
            </div>
          </div>

          {/* Operation */}
          <div className="p-2 bg-white border border-slate-200/70 rounded-lg">
            <div className="text-[10px] text-slate-400">Operation</div>
            <div className="font-semibold text-slate-800 mt-0.5 text-[11px] truncate">
              {estimation.serviceType?.replace(/_/g, " ") || "FERTILIZING"}
            </div>
          </div>

          {/* Priority */}
          <div className="p-2 bg-white border border-slate-200/70 rounded-lg">
            <div className="text-[10px] text-slate-400">Priority</div>
            <div className="font-semibold text-slate-800 mt-0.5 text-[11px]">
              {estimation.priorityMultiplier}x <span className="text-[10px] font-normal text-slate-400">({estimation.priority})</span>
            </div>
          </div>

          {/* Discount */}
          <div className="p-2 bg-white border border-slate-200/70 rounded-lg">
            <div className="text-[10px] text-slate-400">Discount</div>
            <div className="font-semibold text-slate-800 mt-0.5 text-[11px]">
              {hasDiscount ? (
                <span className="text-emerald-700">-{estimation.areaDiscountPercent}% ({currency} {formattedDiscount})</span>
              ) : (
                <span className="text-slate-400 font-normal">None</span>
              )}
            </div>
          </div>
        </div>

        {/* Backend Breakdown Summary */}
        {estimation.breakdownSummary && (
          <p className="text-[11px] text-slate-500 mt-2.5 pt-2 border-t border-slate-100 leading-relaxed">
            {estimation.breakdownSummary}
          </p>
        )}
      </div>

      {/* Expandable Mathematical Formula Breakdown */}
      <div className="bg-white/60 border-t border-slate-200/60">
        <button
          type="button"
          onClick={() => setShowFormulaDetails((prev) => !prev)}
          className="w-full px-4 py-2 text-[11px] font-medium text-slate-600 hover:text-slate-900 flex items-center justify-between transition-colors cursor-pointer"
        >
          <span>{showFormulaDetails ? "Hide breakdown" : "View calculation breakdown"}</span>
          {showFormulaDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showFormulaDetails && (
          <div className="px-4 pb-3 pt-1 space-y-1.5 text-xs border-t border-slate-200/60 font-mono text-[11px] text-slate-700">
            <div className="flex justify-between py-0.5">
              <span className="text-slate-500">Base Cost ({estimation.area} ac × {currency} {formattedBaseRate}):</span>
              <span>{currency} {Number(estimation.baseRatePerAcre * estimation.area).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-500">Crop Multiplier:</span>
              <span>× {estimation.cropMultiplier}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-500">Priority Multiplier:</span>
              <span>× {estimation.priorityMultiplier}</span>
            </div>
            {hasDiscount && (
              <div className="flex justify-between py-0.5 text-emerald-700">
                <span>Volume Discount ({estimation.areaDiscountPercent}%):</span>
                <span>- {currency} {formattedDiscount}</span>
              </div>
            )}
            <div className="flex justify-between py-1 font-semibold text-slate-900 border-t border-slate-200/60 mt-1">
              <span>Final Estimate:</span>
              <span className="text-emerald-800">{currency} {formattedTotal}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CostEstimationCard;
