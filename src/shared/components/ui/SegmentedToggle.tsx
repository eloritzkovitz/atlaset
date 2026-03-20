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
  className?: string;
  wrap?: boolean;
  disabled?: boolean;
}

export function SegmentedToggle<T extends string>({
  value,
  options,
  onChange,
  className = "",
  wrap = false,
  disabled = false,
}: SegmentedToggleProps<T>) {
  return (
    <div className={`flex gap-2 ${wrap ? "flex-wrap" : ""} ${className}`}>
      {options.map((opt) => (
        <button
          key={opt.value}
          className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
            value === opt.value
              ? opt.colorClass || "bg-primary text-white"
              : "bg-surface hover:bg-surface-hover"
          }`}
          onClick={() => onChange(opt.value)}
          disabled={disabled}
        >
          {opt.label}
          {typeof opt.count === "number" && (
            <span className="ml-1 text-xs text-muted align-middle">
              {opt.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
