import { useMemo, type FC } from "react";
import { Clock, ShieldAlert, LogOut, RefreshCw } from "lucide-react";

export interface SessionWarningModalProps {
  isOpen: boolean;
  remainingSeconds: number;
  onStayLoggedIn: () => void;
  onLogoutNow: () => void;
  isRefreshing?: boolean;
}

export const SessionWarningModal: FC<SessionWarningModalProps> = ({
  isOpen,
  remainingSeconds,
  onStayLoggedIn,
  onLogoutNow,
  isRefreshing = false,
}) => {
  if (!isOpen) return null;

  // Format countdown into mm:ss
  const formattedCountdown = useMemo(() => {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }, [remainingSeconds]);

  const isUrgent = remainingSeconds <= 30;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="session-warning-title"
      aria-describedby="session-warning-desc"
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-100 text-slate-800 font-sans">
        {/* Header Icon + Title */}
        <div className="flex items-center gap-3.5">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors ${
              isUrgent
                ? "bg-rose-100 text-rose-600 animate-pulse"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {isUrgent ? (
              <ShieldAlert className="h-6 w-6" />
            ) : (
              <Clock className="h-6 w-6" />
            )}
          </div>
          <div>
            <h3 id="session-warning-title" className="text-lg font-bold text-slate-900 tracking-tight">
              Inactivity Notice
            </h3>
            <p className="text-xs text-slate-500">Security Session Management</p>
          </div>
        </div>

        {/* Description */}
        <p id="session-warning-desc" className="mt-4 text-sm text-slate-600 leading-relaxed">
          You have been inactive for an extended period. For data security, your session will automatically terminate in:
        </p>

        {/* Countdown Box */}
        <div
          className={`my-5 flex flex-col items-center justify-center rounded-xl p-4 border transition-all ${
            isUrgent
              ? "bg-rose-50/80 border-rose-200 text-rose-700"
              : "bg-slate-50 border-slate-200 text-slate-900"
          }`}
        >
          <span className="font-mono text-3xl font-extrabold tracking-widest">
            {formattedCountdown}
          </span>
          <span className="mt-1 text-[11px] font-medium tracking-wide uppercase text-slate-400">
            Minutes : Seconds
          </span>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onLogoutNow}
            disabled={isRefreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Log Out Now</span>
          </button>

          <button
            type="button"
            onClick={onStayLoggedIn}
            disabled={isRefreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all shadow-sm active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            {isRefreshing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : null}
            <span>{isRefreshing ? "Refreshing..." : "Stay Logged In"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionWarningModal;
