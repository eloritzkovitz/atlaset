interface CheckboxProps {
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  onClick?: React.MouseEventHandler<HTMLInputElement>;
}

export function Checkbox({
  checked,
  disabled,
  onChange,
  label,
}: CheckboxProps) {
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
        className={`
          w-5 h-5 rounded transition-colors border-2 flex items-center justify-center
          border-muted bg-transparent
          hover:border-muted-hover
          peer-checked:border-primary peer-checked:bg-primary
          peer-checked:hover:border-primary-hover peer-checked:hover:bg-primary-hover
          ${disabled ? "bg-muted border-muted" : ""}
          `}
      >
        <svg
          className={`w-3 h-3 transition-colors duration-150 ${
            checked
              ? disabled
                ? "text-muted"
                : "text-white"
              : "text-transparent"
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          viewBox="0 0 24 24"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
      </span>
      {label && <span className="ml-2">{label}</span>}
    </label>
  );
}
