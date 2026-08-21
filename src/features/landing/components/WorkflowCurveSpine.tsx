import { motion, type MotionValue } from "framer-motion";

interface WorkflowCurveSpineProps {
  path: string;
  height: number;
  pathLength: MotionValue<number>;
}

export function WorkflowCurveSpine({ path, height, pathLength }: WorkflowCurveSpineProps) {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-8 bottom-8 w-12 hidden md:block pointer-events-none z-0">
      <svg
        className="w-full h-full overflow-visible"
        viewBox={`0 0 48 ${height}`}
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="line-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#062419" />
            <stop offset="30%" stopColor="#2563eb" />
            <stop offset="60%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>

        {/* Base grey curve */}
        <path
          d={path}
          stroke="#e2e8f0"
          strokeWidth="2.5"
          strokeDasharray="6 6"
          className="opacity-70"
        />

        {/* Animated scroll-linked curve */}
        <motion.path
          d={path}
          stroke="url(#line-grad)"
          strokeWidth="3"
          strokeDasharray="6 6"
          style={{ pathLength }}
        />
      </svg>
    </div>
  );
}
