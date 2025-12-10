import { useState } from "react";
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
  const stars = [1, 2, 3, 4, 5];
  const displayValue = hoverValue !== undefined ? hoverValue : value;
  const isHovering = hoverValue !== undefined;
  const selectedColor = STAR_SELECTED_COLOR;
  const hoverColor = STAR_HOVER_COLOR;

  // If value is undefined or -1, show all empty stars
  const showEmpty =
    displayValue === undefined || displayValue === null || displayValue === -1;

  return (
    <div
      className="flex items-center"
      onMouseLeave={() => setHoverValue(undefined)}
    >
      {stars.map((star) => {
        if (showEmpty) {
          return (
            <span
              key={star}
              className="relative inline-block align-middle w-7 h-7"
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
            className={
              (readOnly ? "" : "cursor-pointer ") +
              "relative inline-block align-middle w-7 h-7"
            }
            onMouseMove={
              readOnly
                ? undefined
                : (e) => {
                    if (e.nativeEvent.offsetX < 14) {
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
                    if (e.nativeEvent.offsetX < 14) {
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
