import { useState, useEffect, useRef } from "react";
import { FaStar } from "react-icons/fa6";
import {
  STAR_SELECTED_COLOR,
  STAR_HOVER_COLOR,
  STAR_UNSELECTED_COLOR,
  STAR_SIZE,
} from "./star";
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

  const stars = [1, 2, 3, 4, 5];
  const displayValue = hoverValue !== undefined ? hoverValue : value;
  const isHovering = hoverValue !== undefined;
  const selectedColor = STAR_SELECTED_COLOR;
  const hoverColor = STAR_HOVER_COLOR;

  // If value is undefined or -1, show all empty stars
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
    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
    };
  }, [hoverValue, readOnly]);

  return (
    <div
      ref={containerRef}
      className="flex items-center"
      onMouseLeave={() => setHoverValue(undefined)}
    >
      {stars.map((star) => {
        if (showEmpty) {
          return (
            <span
              key={star}
              className={`relative inline-block align-middle w-6 h-6 ${
                readOnly ? "" : "cursor-pointer"
              }`}
              onMouseEnter={
                readOnly ? undefined : () => setHoverValue(undefined)
              }
            >
              <FaStar size={STAR_SIZE} color={STAR_UNSELECTED_COLOR} />
            </span>
          );
        }

        const full = displayValue >= star;
        const half = displayValue >= star - 0.5 && displayValue < star;
        const color = isHovering ? hoverColor : selectedColor;

        return (
          <span
            key={star}
            className={`relative inline-block align-middle w-6 h-6 ${
              readOnly ? "" : "cursor-pointer"
            }`}
            onMouseMove={
              readOnly
                ? undefined
                : (e) => {
                    const bounds = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - bounds.left;
                    if (x < 12) {
                      setHoverValue(star - 0.5);
                    } else {
                      setHoverValue(star);
                    }
                  }
            }
            onMouseDown={
              readOnly || !onChange
                ? undefined
                : (e) => {
                    const bounds = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - bounds.left;
                    if (x < 12) {
                      onChange(star - 0.5);
                    } else {
                      onChange(star);
                    }
                  }
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
