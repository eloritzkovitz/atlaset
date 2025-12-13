interface CheckboxProps {
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  onClick?: React.MouseEventHandler<HTMLInputElement>;
};

export function Checkbox({ checked, disabled, onChange, label }: CheckboxProps) {
  return (
    <label
      className="inline-flex items-center cursor-pointer relative"
      onClick={(e) => e.stopPropagation()}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span
        className={
          "w-5 h-5 rounded transition-colors border-2 border-gray-400 peer-checked:border-blue-500 flex items-center justify-center"
        }
      >
        <svg
          className={`w-3 h-3 ${checked ? "text-white" : "text-transparent"}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          viewBox="0 0 24 24"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
      </span>
      {label && <span className="ml-2 text-gray-200">{label}</span>}
    </label>
  );
}
