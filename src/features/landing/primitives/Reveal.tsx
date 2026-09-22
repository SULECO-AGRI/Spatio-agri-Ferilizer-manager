import * as React from "react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { revealVariants } from "./variants";

export function Reveal({
  children,
  delay = 0,
  className,
  as: As = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  const MotionTag = motion(As as "div");
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={revealVariants}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}
