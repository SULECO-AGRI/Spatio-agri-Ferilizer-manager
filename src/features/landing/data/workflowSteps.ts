import { MapPin, PlaneTakeoff, Cpu, FileDown, TrendingUp, type LucideIcon } from "lucide-react";
import step_01 from "@/Images/step_01.avif";
import step_02 from "@/Images/step_02.avif";
import step_03 from "@/Images/step_03.avif";
import step_04 from "@/Images/step_04.avif";
import step_05 from "@/Images/step_05.avif";

export interface WorkflowStep {
  title: string;
  body: string;
  icon: LucideIcon;
  color: string;
  glow: string;
  align: "left" | "right";
  imageUrl: string;
}

export const workflowSteps: WorkflowStep[] = [
  {
    title: "Request a Scan",
    body: "Log into the dashboard and pin your field boundaries. Select your crop type and priority level.",
    icon: MapPin,
    color: "bg-[#062419] text-emerald-400 border-emerald-500/30",
    glow: "shadow-[0_0_20px_rgba(16,185,129,0.15)]",
    align: "left",
    imageUrl: step_01,
  },
  {
    title: "Automated Flight",
    body: "A certified Spatio pilot arrives within 24 hours to scan fields with centimeter-level resolution.",
    icon: PlaneTakeoff,
    color: "bg-blue-950 text-blue-400 border-blue-500/30",
    glow: "shadow-[0_0_20px_rgba(59,130,246,0.15)]",
    align: "right",
    imageUrl: step_02,
  },
  {
    title: "Data Processing",
    body: "Cloud-based AI analyzes crop health, NDVI index, and multispectral data in minutes.",
    icon: Cpu,
    color: "bg-teal-950 text-teal-400 border-teal-500/30",
    glow: "shadow-[0_0_20px_rgba(20,184,166,0.15)]",
    align: "left",
    imageUrl: step_03,
  },
  {
    title: "Get Your Map",
    body: "Receive a prescription file ready to plug directly into your tractor's variable-rate control system.",
    icon: FileDown,
    color: "bg-[#0c1020] text-indigo-400 border-indigo-500/35",
    glow: "shadow-[0_0_20px_rgba(99,102,241,0.15)]",
    align: "right",
    imageUrl: step_04,
  },
  {
    title: "Optimize Yield",
    body: "Apply variable-rate inputs surgically to maximize yield, cut costs, and boost crop health.",
    icon: TrendingUp,
    color: "bg-[#042010] text-[#10b981] border-emerald-500/35",
    glow: "shadow-[0_0_25px_rgba(16,185,129,0.3)]",
    align: "left",
    imageUrl: step_05,
  },
];
