import { useState, useCallback } from "react";
import { RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface RefreshButtonProps {
  onRefresh: () => Promise<any> | void;
  isLoading?: boolean;
  isFetching?: boolean;
  label?: string;
  variant?: "default" | "iconOnly";
  className?: string;
  title?: string;
  disabled?: boolean;
}

export function RefreshButton({
  onRefresh,
  isLoading = false,
  isFetching = false,
  label = "Refresh",
  variant = "default",
  className = "",
  title = "Refresh data",
  disabled = false,
}: RefreshButtonProps) {
  const [manualSpinning, setManualSpinning] = useState(false);

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (disabled || manualSpinning || isFetching) return;

      setManualSpinning(true);
      const startTime = Date.now();

      try {
        await Promise.resolve(onRefresh());
      } catch (err) {
        console.error("Refresh failed:", err);
      } finally {
        const elapsed = Date.now() - startTime;
        const minSpinDuration = 700; // Minimum 700ms for full satisfying rotation
        const remaining = Math.max(0, minSpinDuration - elapsed);

        setTimeout(() => {
          setManualSpinning(false);
        }, remaining);
      }
    },
    [onRefresh, disabled, manualSpinning, isFetching],
  );

  const isSpinning = manualSpinning || isFetching || isLoading;

  if (variant === "iconOnly") {
    return (
      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={handleClick}
        disabled={disabled || isSpinning}
        title={title}
        aria-label={label}
        className={`group p-2 bg-white border border-slate-200/80 hover:bg-slate-50 hover:border-slate-300 rounded-xl text-slate-600 hover:text-emerald-700 shadow-2xs transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center ${className}`}
      >
        <RefreshCw
          className={`w-4 h-4 transition-transform duration-300 ${
            isSpinning
              ? "animate-spin text-emerald-600"
              : "text-slate-500 group-hover:text-emerald-700 group-hover:rotate-45"
          }`}
        />
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.96 }}
      onClick={handleClick}
      disabled={disabled || isSpinning}
      title={title}
      className={`group flex items-center gap-2 px-3.5 py-2 border border-slate-200/90 rounded-xl bg-white text-slate-700 text-xs font-normal hover:bg-slate-50 hover:border-slate-300 disabled:opacity-60 transition-all cursor-pointer shadow-2xs ${className}`}
    >
      <RefreshCw
        className={`w-3.5 h-3.5 transition-transform duration-300 ${
          isSpinning
            ? "animate-spin text-emerald-600"
            : "text-slate-500 group-hover:text-emerald-700 group-hover:rotate-45"
        }`}
      />
      <span className="font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
        {isSpinning ? "Refreshing..." : label}
      </span>
    </motion.button>
  );
}

export default RefreshButton;
