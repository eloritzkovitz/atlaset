import { useEffect, useRef } from "react";

interface PrefixHintProps {
  topSuggestion?: string;
  propCandidate?: string;
  isValid?: boolean;
  left?: number;
  maxWidth?: number | string;
  className?: string;
  onWidthChange?: (w: number) => void;
}

export function PrefixHint({
  topSuggestion,
  propCandidate = "",
  isValid = false,
  left = 40,
  maxWidth = 160,
  className = "",
  onWidthChange,
}: PrefixHintProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  // Measure the width of the hint text and report it to the parent for positioning adjustments
  useEffect(() => {
    const el = ref.current;
    if (!el || !isValid) {
      onWidthChange?.(0);
      return;
    }
    const ro = () =>
      onWidthChange?.(Math.ceil(el.getBoundingClientRect().width));
    // measure once on mount/update
    ro();
    // also on window resize
    window.addEventListener("resize", ro);
    return () => window.removeEventListener("resize", ro);
  }, [topSuggestion, propCandidate, isValid, onWidthChange]);

  if (!isValid) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      style={{
        position: "absolute",
        left,
        top: "50%",
        transform: "translateY(calc(-50% + 1px))",
        zIndex: 10,
        maxWidth,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
      className={`pointer-events-none flex items-center text-base text-muted ${className}`}
    >
      {(topSuggestion || propCandidate) + ":"}
    </div>
  );
}
