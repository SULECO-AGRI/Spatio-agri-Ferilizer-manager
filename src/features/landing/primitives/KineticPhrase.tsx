import { useEffect, useState } from "react";

function getGraphemes(str: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new (Intl as any).Segmenter("si", { granularity: "grapheme" });
    return Array.from(segmenter.segment(str), (s: any) => s.segment);
  }
  return Array.from(str);
}

export function KineticPhrase({ phrases }: { phrases: string[] }) {
  const [idx, setIdx] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setCharCount(0);
    setDeleting(false);
  }, [idx, phrases]);

  const currentPhrase = phrases[idx] || "";
  const graphemes = getGraphemes(currentPhrase);
  const displayedText = graphemes.slice(0, charCount).join("");

  useEffect(() => {
    const totalGraphemes = graphemes.length;
    const speed = deleting ? 35 : 65;

    const t = setTimeout(() => {
      if (!deleting) {
        if (charCount < totalGraphemes) {
          setCharCount((c) => c + 1);
        } else {
          setTimeout(() => setDeleting(true), 1600);
        }
      } else {
        if (charCount > 0) {
          setCharCount((c) => c - 1);
        } else {
          setDeleting(false);
          setIdx((i) => (i + 1) % phrases.length);
        }
      }
    }, speed);

    return () => clearTimeout(t);
  }, [charCount, deleting, graphemes.length, phrases.length]);

  return (
    <span className="inline-flex items-baseline">
      <span className="text-primary">{displayedText}</span>
      <span
        className="ml-0.5 inline-block h-[0.9em] w-[2px] translate-y-[2px] bg-primary animate-pulse"
        aria-hidden
      />
    </span>
  );
}
