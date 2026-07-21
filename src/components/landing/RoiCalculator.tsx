import { useEffect, useState } from "react";
import { animate, useMotionValue, useTransform } from "framer-motion";

export function RoiCalculator() {
  const [acres, setAcres] = useState(500);
  const target = Math.round(acres * 42); // $/ac saved

  const val = useMotionValue(0);
  const display = useTransform(val, (v) => `$${Math.round(v).toLocaleString()}`);
  const [text, setText] = useState("$0");

  useEffect(() => {
    const c = animate(val, target, { duration: 0.7, ease: "easeOut" });
    const unsub = display.on("change", setText);
    return () => {
      c.stop();
      unsub();
    };
  }, [target, val, display]);

  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          ROI Calculator
        </div>
        <div className="mt-2 font-display text-3xl font-semibold text-primary">
          {text}
          <span className="text-base font-medium text-muted-foreground"> / season</span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Est. input savings at ~$42/ac</p>
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex justify-between text-xs font-mono text-muted-foreground">
          <span>Acreage</span>
          <span className="text-foreground">{acres.toLocaleString()} ac</span>
        </div>
        <input
          type="range"
          min={50}
          max={5000}
          step={50}
          value={acres}
          onChange={(e) => setAcres(Number(e.target.value))}
          aria-label="Acreage"
          className="w-full accent-[var(--color-primary)]"
        />
      </div>
    </div>
  );
}
