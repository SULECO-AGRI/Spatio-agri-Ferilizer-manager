import { useEffect, useState } from "react";

export function KineticPhrase({ phrases }: { phrases: string[] }) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[idx];
    const speed = deleting ? 40 : 70;
    const t = setTimeout(() => {
      if (!deleting) {
        const next = current.slice(0, text.length + 1);
        setText(next);
        if (next === current) setTimeout(() => setDeleting(true), 1400);
      } else {
        const next = current.slice(0, text.length - 1);
        setText(next);
        if (next === "") {
          setDeleting(false);
          setIdx((i) => (i + 1) % phrases.length);
        }
      }
    }, speed);
    return () => clearTimeout(t);
  }, [text, deleting, idx, phrases]);

  return (
    <span className="inline-flex items-baseline">
      <span className="text-primary">{text}</span>
      <span
        className="ml-0.5 inline-block h-[0.9em] w-[2px] translate-y-[2px] bg-primary animate-pulse"
        aria-hidden
      />
    </span>
  );
}
