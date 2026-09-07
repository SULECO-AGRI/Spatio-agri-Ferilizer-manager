import { motion } from "framer-motion";
import type { WorkflowStep } from "../data/workflowSteps";

interface WorkflowStepDesktopProps {
  step: WorkflowStep;
  index: number;
}

export function WorkflowStepDesktop({ step, index }: WorkflowStepDesktopProps) {
  const isEven = index % 2 === 1;

  return (
    <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-center gap-12 lg:gap-16 w-full">
      {/* Left Side: Content for odd steps; Pop-up Image for even steps */}
      <div className="flex justify-end">
        {!isEven ? (
          <motion.div
            initial={{ opacity: 0, x: -35, y: 15 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: false, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-3 pr-4 text-right max-w-lg bg-white/70 backdrop-blur-sm border border-slate-200/70 p-6 rounded-2xl shadow-xs hover:shadow-md hover:border-emerald-500/30 transition-all duration-300 group"
          >
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-slate-100 text-slate-700 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors">
              <span>Step 0{index + 1}</span>
            </div>
            <h3 className="font-display text-xl lg:text-2xl font-bold text-slate-900 leading-tight">
              {step.title}
            </h3>
            <p className="text-slate-500 font-sans text-sm sm:text-base leading-relaxed">
              {step.body}
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: -35 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: false, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 100, damping: 18 }}
            className="relative max-w-[320px] aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200/80 shadow-md group bg-white p-1.5 hover:shadow-xl transition-all duration-300"
          >
            <img
              src={step.imageUrl}
              alt={step.title}
              className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5 pointer-events-none" />
          </motion.div>
        )}
      </div>

      {/* Center Animated Step Node */}
      <div className="flex flex-col items-center justify-center relative z-10">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ type: "spring", stiffness: 150, damping: 15 }}
          whileHover={{ scale: 1.12, rotate: 5 }}
          className={`h-16 w-16 rounded-2xl border-2 backdrop-blur-md flex items-center justify-center cursor-pointer transition-all duration-300 shadow-md ring-8 ring-slate-50/80 ${step.color} ${step.glow}`}
        >
          <step.icon className="w-7 h-7 stroke-[2.2]" />
        </motion.div>
      </div>

      {/* Right Side: Pop-up Image for odd steps; Content for even steps */}
      <div className="flex justify-start">
        {isEven ? (
          <motion.div
            initial={{ opacity: 0, x: 35, y: 15 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: false, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-3 pl-4 text-left max-w-lg bg-white/70 backdrop-blur-sm border border-slate-200/70 p-6 rounded-2xl shadow-xs hover:shadow-md hover:border-emerald-500/30 transition-all duration-300 group"
          >
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-slate-100 text-slate-700 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors">
              <span>Step 0{index + 1}</span>
            </div>
            <h3 className="font-display text-xl lg:text-2xl font-bold text-slate-900 leading-tight">
              {step.title}
            </h3>
            <p className="text-slate-500 font-sans text-sm sm:text-base leading-relaxed">
              {step.body}
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 35 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: false, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 100, damping: 18 }}
            className="relative max-w-[320px] aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200/80 shadow-md group bg-white p-1.5 hover:shadow-xl transition-all duration-300"
          >
            <img
              src={step.imageUrl}
              alt={step.title}
              className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5 pointer-events-none" />
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default WorkflowStepDesktop;
