import { useRef } from "react";
import { useScroll, useSpring } from "framer-motion";
import { Reveal } from "@/pages/landing/primitives/Reveal";
import { workflowSteps } from "./data/workflowSteps";
import { WorkflowLinearSpine } from "./components/WorkflowLinearSpine";
import { WorkflowStepDesktop } from "./components/WorkflowStepDesktop";
import { WorkflowStepMobile } from "./components/WorkflowStepMobile";

export function WorkflowView() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <section
      ref={containerRef}
      id="how-it-works"
      className="relative w-full py-28 md:py-36 bg-slate-50/60 border-y border-slate-100 overflow-hidden font-sans"
    >
      {/* Sleek Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] grid-bg" />

      {/* Decorative ambient gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 z-10">
        {/* Section Header */}
        <Reveal className="mb-20 text-center max-w-3xl mx-auto">
          <h2 className="font-display text-4xl font-bold tracking-tight text-slate-900 md:text-5xl leading-tight">
            From Sky to Soil in 5 Simple Steps
          </h2>
          <p className="mt-4 text-slate-500 max-w-xl mx-auto text-base md:text-lg">
            A seamless digital pipeline designed for speed, sub-inch accuracy, and automated crop analytics.
          </p>
        </Reveal>

        {/* Timeline Container */}
        <div className="relative max-w-5xl mx-auto mt-16">
          {/* Animated Central Linear Spine (Desktop) */}
          <WorkflowLinearSpine progress={smoothProgress} />

          {/* Left Vertical Track for Mobile */}
          <div className="absolute left-[23px] top-6 bottom-6 w-[2px] bg-slate-200 md:hidden z-0" />

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

export default WorkflowView;
