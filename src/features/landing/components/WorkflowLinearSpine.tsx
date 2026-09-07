import { motion, type MotionValue } from "framer-motion";

interface WorkflowLinearSpineProps {
  progress: MotionValue<number>;
}

export function WorkflowLinearSpine({ progress }: WorkflowLinearSpineProps) {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-10 bottom-10 w-8 hidden md:flex items-center justify-center pointer-events-none z-0">
      {/* Background Subtle Line Track */}
      <div className="w-[2px] h-full bg-slate-200/80 relative rounded-full overflow-hidden">
        {/* Animated Progress Fill Beam */}
        <motion.div
          className="w-full h-full bg-gradient-to-b from-[#062419] via-[#10b981] to-[#14b8a6] origin-top rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)]"
          style={{ scaleY: progress }}
        />
      </div>

      {/* Ambient Laser Particle Glow traveling down */}
      <motion.div
        className="absolute w-3 h-16 bg-gradient-to-b from-transparent via-emerald-400 to-transparent blur-xs opacity-60 rounded-full"
        style={{
          top: "0%",
          translateY: "-50%",
        }}
        animate={{
          top: ["0%", "100%"],
          opacity: [0, 0.9, 0],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

export default WorkflowLinearSpine;
