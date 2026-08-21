import { motion } from "framer-motion";
import type { WorkflowStep } from "../data/workflowSteps";

interface WorkflowStepDesktopProps {
  step: WorkflowStep;
  index: number;
}

export function WorkflowStepDesktop({ step, index }: WorkflowStepDesktopProps) {
  const isEven = index % 2 === 1;

  return (
    <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-center gap-12 w-full">
      {/* Left Side: Content for odd steps; Pop-up Image for even steps */}
      <div className="flex justify-end">
        {!isEven ? (
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-2 pr-4 text-right"
          >
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Step 0{index + 1}
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
              {step.title}
            </h3>
            <p className="text-slate-500 font-sans text-sm sm:text-base leading-relaxed max-w-md ml-auto">
              {step.body}
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, x: -30 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: false, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="relative max-w-[280px] aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200/60 shadow-lg group bg-white p-1"
          >
            <img
              src={step.imageUrl}
              alt={step.title}
              className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
            />
          </motion.div>
        )}
      </div>

      {/* Center Badge */}
      <div className="flex justify-center z-10">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ type: "spring", stiffness: 120, damping: 15 }}
          whileHover={{ scale: 1.08 }}
          className={`h-16 w-16 rounded-full border-2 backdrop-blur-sm flex items-center justify-center cursor-pointer transition-shadow ring-8 ring-slate-50/50 ${step.color} ${step.glow}`}
        >
          <step.icon className="w-6 h-6 stroke-[2]" />
        </motion.div>
      </div>

      {/* Right Side: Pop-up Image for odd steps; Content for even steps */}
      <div className="flex justify-start">
        {isEven ? (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-2 pl-4 text-left"
          >
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Step 0{index + 1}
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
              {step.title}
            </h3>
            <p className="text-slate-500 font-sans text-sm sm:text-base leading-relaxed max-w-md">
              {step.body}
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, x: 30 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: false, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="relative max-w-[280px] aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200/60 shadow-lg group bg-white p-1"
          >
            <img
              src={step.imageUrl}
              alt={step.title}
              className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
