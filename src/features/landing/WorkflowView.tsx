import { useRef } from "react";
import { useScroll, useSpring } from "framer-motion";
import { Reveal } from "@/pages/landing/primitives/Reveal";
import { workflowSteps } from "./data/workflowSteps";
import { useWorkflowCurve } from "./hooks/useWorkflowCurve";
import { WorkflowCurveSpine } from "./components/WorkflowCurveSpine";
import { WorkflowStepDesktop } from "./components/WorkflowStepDesktop";
import { WorkflowStepMobile } from "./components/WorkflowStepMobile";

const WORKFLOW_CURVE_HEIGHT = workflowSteps.length * 160;

export function WorkflowView() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
  });

  const workflowCurvePath = useWorkflowCurve({
    stepCount: workflowSteps.length,
    viewHeight: WORKFLOW_CURVE_HEIGHT,
  });

  return (
    <section
      ref={containerRef}
      id="how-it-works"
      className="relative w-full py-28 md:py-36 bg-slate-50/50 border-y border-slate-100 overflow-hidden font-sans"
    >
      {/* Sleek Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] grid-bg" />

      {/* Decorative gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
        <div className="absolute top-1/3 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 z-10">
        {/* Section Header */}
        <Reveal className="mb-20 text-center max-w-3xl mx-auto">
          <h2 className="font-display text-4xl font-bold tracking-tight text-slate-900 md:text-5xl leading-tight">
            From Sky to Soil in 5 Steps
          </h2>
          <p className="mt-4 text-slate-500 max-w-xl mx-auto text-base md:text-lg">
            A streamlined digital pipeline built for speed, accuracy, and maximum efficiency.
          </p>
        </Reveal>

        {/* Timeline Container */}
        <div className="relative max-w-5xl mx-auto mt-16">
          {/* Animated Curved Spine for Desktop */}
          <WorkflowCurveSpine
            path={workflowCurvePath}
            height={WORKFLOW_CURVE_HEIGHT}
            pathLength={pathLength}
          />

          {/* Vertical dashed line for mobile */}
          <div className="absolute left-6 top-8 bottom-8 w-px border-l-2 border-dashed border-slate-200 md:hidden z-0" />

          {/* Timeline Items */}
          <div className="space-y-16 md:space-y-24 relative z-10">
            {workflowSteps.map((step, index) => (
              <div key={step.title} className="w-full">
                <WorkflowStepDesktop step={step} index={index} />
                <WorkflowStepMobile step={step} index={index} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
