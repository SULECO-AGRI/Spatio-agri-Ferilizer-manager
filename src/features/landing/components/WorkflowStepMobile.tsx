import { motion } from "framer-motion";
import type { WorkflowStep } from "../data/workflowSteps";

interface WorkflowStepMobileProps {
  step: WorkflowStep;
  index: number;
}

export function WorkflowStepMobile({ step, index }: WorkflowStepMobileProps) {
  return (
    <div className="flex md:hidden items-start gap-4 w-full">
      {/* Icon Badge */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: false, margin: "-40px" }}
        transition={{ type: "spring", stiffness: 120, damping: 15 }}
        className={`h-12 w-12 rounded-full border-2 shrink-0 flex items-center justify-center ${step.color} ${step.glow}`}
      >
        <step.icon className="w-5 h-5 stroke-[2]" />
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-40px" }}
        transition={{ duration: 0.5 }}
        className="space-y-2 flex-1"
      >
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
          Step 0{index + 1}
        </span>
        <h3 className="font-display text-lg font-bold text-slate-900 leading-tight">
          {step.title}
        </h3>
        <p className="text-slate-500 font-sans text-xs leading-relaxed">{step.body}</p>

        {/* Mobile image preview */}
        <div className="pt-2 max-w-[200px] aspect-[4/3] rounded-xl overflow-hidden border border-slate-200/60 shadow-xs">
          <img
            src={step.imageUrl}
            alt={step.title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </motion.div>
    </div>
  );
}
