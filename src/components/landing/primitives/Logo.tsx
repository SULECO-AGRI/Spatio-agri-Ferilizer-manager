export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden>
        <circle
          cx="16"
          cy="16"
          r="14"
          stroke="currentColor"
          strokeOpacity="0.25"
          strokeDasharray="2 3"
        />
        <path
          d="M9 20c4-1 7-4 8-11 5 4 5 11-1 13-3 1-6-.5-7-2Z"
          fill="var(--color-primary)"
          fillOpacity="0.9"
        />
        <path
          d="M9 20c3-1 6-4 8-11"
          stroke="var(--color-primary-foreground)"
          strokeOpacity="0.6"
          strokeWidth="0.8"
        />
        <circle cx="24" cy="8" r="1.6" fill="var(--color-primary)" />
        <path
          d="M24 8l4-3"
          stroke="currentColor"
          strokeOpacity="0.5"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
      <span className="font-display text-[15px] font-semibold tracking-tight">
        Spatio<span className="text-primary">Agri</span>
      </span>
    </span>
  );
}
