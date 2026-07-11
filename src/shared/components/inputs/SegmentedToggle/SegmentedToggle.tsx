import { useRef } from "react";
import { useAutoScrollFocus } from "@hooks";

export interface SegmentedToggleOption<T extends string> {
  value: T;
  label: string;
  count?: number;
  colorClass?: string;
}

interface SegmentedToggleProps<T extends string> {
  value: T;
  options: SegmentedToggleOption<T>[];
  onChange: (val: T) => void;
  onDoubleClick?: (val: T) => void;
  className?: string;
  wrap?: boolean;
  disabled?: boolean;
  autoFocusOnSelect?: boolean;
}

export function SegmentedToggle<T extends string>({
  value,
  options,
  onChange,
  onDoubleClick,
  className = "",
  wrap = false,
  disabled = false,
  autoFocusOnSelect = true,
}: SegmentedToggleProps<T>) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useAutoScrollFocus(containerRef, `[data-seg-value="${value}"]`, {
    enabled: autoFocusOnSelect,
    centerInline: true,
  });

  return (
    <div
      ref={containerRef}
      className={`flex gap-2 ${wrap ? "flex-wrap" : ""} ${className}`}
    >
      {options.map((opt) => {
        const isSelected = value === opt.value;

        const hoverClass = !isSelected
          ? opt.colorClass
            ? `hover:${opt.colorClass}/50`
            : "hover:bg-input-hover"
          : "";

        return (
          <button
            key={opt.value}
            data-seg-value={opt.value}
            aria-pressed={isSelected}
            className={`px-3 py-1 rounded-full text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-ring-focus ${
              isSelected
                ? `${opt.colorClass || "bg-primary"} text-white`
                : `bg-surface ${hoverClass}`
            }`}
            onClick={() => onChange(opt.value)}
            onDoubleClick={() => onDoubleClick?.(opt.value)}
            disabled={disabled}
          >
            <span className="inline-flex items-center gap-1.5">
              <span className="align-middle" dir="auto">
                {opt.label}
              </span>

              {typeof opt.count === "number" && (
                <span
                  dir="ltr"
                  className="text-xs text-muted align-middle font-normal tracking-wide [unicode-bidi:isolate]"
                >
                  {opt.count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
