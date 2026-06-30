import { useRef } from "react";
import { useLanguage } from "@features/settings";
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
  const { isRtl } = useLanguage();
  const containerRef = useRef<HTMLDivElement | null>(null);  

  // Auto-scroll and focus the selected option when it changes
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

        const baseBg = opt.colorClass
          ? opt.colorClass.split(" ").find((c) => c.startsWith("bg-"))
          : null;
        const hoverClass = !isSelected
          ? baseBg
            ? `hover:${baseBg}/50`
            : "hover:bg-surface-hover"
          : "";

        const labelSpan = (
          <span className="align-middle" dir="auto">
            {opt.label}
          </span>
        );
        const countSpan =
          typeof opt.count === "number" ? (
            <span
              dir="ltr"
              style={{ unicodeBidi: "isolate" }}
              className="text-xs text-muted align-middle"
            >
              {opt.count}
            </span>
          ) : null;

        return (
          <button
            key={opt.value}
            data-seg-value={opt.value}
            data-rtl={isRtl}
            aria-pressed={isSelected}
            className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
              isSelected
                ? `${opt.colorClass || "bg-primary"} text-white`
                : `bg-surface ${hoverClass}`
            }`}
            onClick={() => onChange(opt.value)}
            onDoubleClick={() => onDoubleClick?.(opt.value)}
            disabled={disabled}
          >
            <span
              className="inline-flex items-center gap-1"
              dir={isRtl ? "ltr" : undefined}
            >
              {isRtl ? (
                <>
                  {countSpan}
                  {labelSpan}
                </>
              ) : (
                <>
                  {labelSpan}
                  {countSpan}
                </>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
