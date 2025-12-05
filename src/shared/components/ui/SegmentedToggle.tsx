export interface SegmentedToggleOption<T extends string> {
  value: T;
  label: string;
  colorClass?: string;
}

interface SegmentedToggleProps<T extends string> {
  value: T;
  options: SegmentedToggleOption<T>[];
  onChange: (val: T) => void;
  className?: string;
}

export function SegmentedToggle<T extends string>({
  value,
  options,
  onChange,
  className = "",
}: SegmentedToggleProps<T>) {
  return (
    <div className={`flex gap-2 ${className}`}>
      {options.map((opt) => (
        <button
          key={opt.value}
          className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
            value === opt.value
              ? opt.colorClass || "bg-blue-500 text-white"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
