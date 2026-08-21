import { useMemo } from "react";

interface WorkflowCurveOptions {
  stepCount: number;
  viewHeight: number;
  centerX?: number;
  amplitude?: number;
}

/**
 * Computes a smooth alternating cubic Bézier S-curve passing through each workflow step's badge.
 */
export function useWorkflowCurve({
  stepCount,
  viewHeight,
  centerX = 24,
  amplitude = 64,
}: WorkflowCurveOptions) {
  const path = useMemo(() => {
    if (stepCount <= 0) return "";
    const rowHeight = viewHeight / stepCount;
    const ys = Array.from({ length: stepCount }, (_, i) => (i + 0.5) * rowHeight);

    let d = `M ${centerX},${ys[0]}`;
    for (let i = 0; i < ys.length - 1; i++) {
      const y0 = ys[i];
      const y1 = ys[i + 1];
      const dir = i % 2 === 0 ? 1 : -1;
      const cx = centerX + dir * amplitude;
      const c1y = y0 + (y1 - y0) * 0.33;
      const c2y = y0 + (y1 - y0) * 0.67;
      d += ` C ${cx},${c1y} ${cx},${c2y} ${centerX},${y1}`;
    }
    return d;
  }, [stepCount, viewHeight, centerX, amplitude]);

  return path;
}
