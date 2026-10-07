import { motion } from "framer-motion";
import type { WorkflowStep } from "../data/workflowSteps";
import { useLanguage } from "@/context/LanguageContext";

const sinhalaSteps = [
  {
    title: "පරීක්ෂාවක් ඉල්ලුම් කිරීම",
    body: "උපකරණ පුවරුවට ඇතුල් වී ඔබගේ වගා බිමේ මායිම් ලකුණු කරන්න. බෝග වර්ගය සහ ප්‍රමුඛතාවය තෝරන්න.",
  },
  {
    title: "ස්වයංක්‍රීය ගුවන් පියාසැරිය",
    body: "සෙන්ටිමීටර මට්ටමේ නිරවද්‍යතාවයකින් ක්ෂේත්‍රය පරිලෝකනය කිරීමට පැය 24ක් තුළ සහතික ලත් නියමුවෙකු පැමිණේ.",
  },
  {
    title: "දත්ත විශ්ලේෂණය",
    body: "වලාකුළු තාක්ෂණික AI මගින් NDVI දර්ශකය, බෝග සෞඛ්‍යය සහ බහු-වර්ණාවලි දත්ත මිනිත්තු කිහිපයකින් විශ්ලේෂණය කෙරේ.",
  },
  {
    title: "පොහොර නිර්දේශ සිතියම",
    body: "ට්‍රැක්ටරයේ හෝ ඩ්‍රෝන යන්ත්‍රයේ විචල්‍ය අනුපාත පාලන පද්ධතියට සෘජුවම ඇතුළත් කළ හැකි නිර්දේශ ගොනුව ලබා ගන්න.",
  },
  {
    title: "අස්වැන්න උපරිම කිරීම",
    body: "පොහොර නාස්තිය අවම කර, වියදම් අඩු කර ගනිමින් බෝගයේ නිරෝගීතාවය සහ අස්වැන්න උපරිම කර ගන්න.",
  },
];

interface WorkflowStepMobileProps {
  step: WorkflowStep;
  index: number;
}

export function WorkflowStepMobile({ step, index }: WorkflowStepMobileProps) {
  const { isSinhala } = useLanguage();
  const displayTitle = isSinhala && sinhalaSteps[index] ? sinhalaSteps[index].title : step.title;
  const displayBody = isSinhala && sinhalaSteps[index] ? sinhalaSteps[index].body : step.body;
  const stepLabel = isSinhala ? `පියවර 0${index + 1}` : `Step 0${index + 1}`;

  return (
    <div className="flex md:hidden items-start gap-4 w-full relative">
      {/* Icon Badge */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: false, margin: "-40px" }}
        transition={{ type: "spring", stiffness: 120, damping: 15 }}
        className={`h-12 w-12 rounded-xl border-2 shrink-0 flex items-center justify-center z-10 shadow-sm ${step.color} ${step.glow}`}
      >
        <step.icon className="w-5 h-5 stroke-[2]" />
      </motion.div>

      {/* Content Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-40px" }}
        transition={{ duration: 0.5 }}
        className="space-y-2 flex-1 bg-white/80 backdrop-blur-sm border border-slate-200/80 p-4 rounded-2xl shadow-xs"
      >
        <span className={`inline-block text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md ${isSinhala ? "font-sinhala" : ""}`}>
          {stepLabel}
        </span>
        <h3 className={`font-display text-base font-bold text-slate-900 ${isSinhala ? "leading-snug font-sinhala" : "leading-tight"}`}>
          {displayTitle}
        </h3>
        <p className={`text-slate-500 font-sans text-xs ${isSinhala ? "leading-relaxed font-sinhala" : "leading-relaxed"}`}>{displayBody}</p>

        {/* Mobile image preview */}
        <div className="pt-2 max-w-[240px] aspect-[4/3] rounded-xl overflow-hidden border border-slate-200/60 shadow-xs">
          <img
            src={step.imageUrl}
            alt={displayTitle}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </motion.div>
    </div>
  );
}

export default WorkflowStepMobile;
