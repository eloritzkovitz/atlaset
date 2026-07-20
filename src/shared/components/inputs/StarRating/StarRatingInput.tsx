import { useState, useEffect, useRef } from "react";
import { FaStar } from "react-icons/fa6";
import {
  STAR_SELECTED_COLOR,
  STAR_HOVER_COLOR,
  STAR_UNSELECTED_COLOR,
  STAR_SIZE,
} from "./constants";
import { HalfStar } from "./HalfStar";

interface StarRatingInputProps {
  value: number | null | undefined;
  onChange?: (v: number | undefined) => void;
  readOnly?: boolean;
}

export function StarRatingInput({
  value,
  onChange,
  readOnly,
}: StarRatingInputProps) {
  const [hoverValue, setHoverValue] = useState<number | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  const displayValue = hoverValue !== undefined ? hoverValue : value;
  const showEmpty =
    displayValue === undefined || displayValue === null || displayValue === -1;

  // Handle global mouse move to detect when user moves outside the component
  useEffect(() => {
    if (readOnly || hoverValue === undefined) return;
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setHoverValue(undefined);
      }
    };
    window.addEventListener("mousemove", handleGlobalMouseMove);
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, [hoverValue, readOnly]);

  // Helper to calculate if the pointer is on the left half of the star container
  const getRatingValue = (
    e: React.MouseEvent<HTMLSpanElement>,
    star: number,
  ) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    return e.clientX - bounds.left < 12 ? star - 0.5 : star;
  };

  return (
    <div
      ref={containerRef}
      className="flex items-center"
      onMouseLeave={() => setHoverValue(undefined)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const full = !showEmpty && displayValue >= star;
        const half =
          !showEmpty && displayValue >= star - 0.5 && displayValue < star;
        const color =
          hoverValue !== undefined ? STAR_HOVER_COLOR : STAR_SELECTED_COLOR;

        return (
          <span
            key={star}
            className={`relative inline-block align-middle w-6 h-6 ${readOnly ? "" : "cursor-pointer"}`}
            onMouseEnter={
              readOnly || !showEmpty
                ? undefined
                : () => setHoverValue(undefined)
            }
            onMouseMove={
              readOnly || showEmpty
                ? undefined
                : (e) => setHoverValue(getRatingValue(e, star))
            }
            onMouseDown={
              readOnly || showEmpty || !onChange
                ? undefined
                : (e) => onChange(getRatingValue(e, star))
            }
          >
            {full ? (
              <FaStar size={STAR_SIZE} color={color} />
            ) : half ? (
              <HalfStar size={STAR_SIZE} color={color} />
            ) : (
              <FaStar size={STAR_SIZE} color={STAR_UNSELECTED_COLOR} />
            )}
          </span>
        );
      })}
    </div>
  );
}
