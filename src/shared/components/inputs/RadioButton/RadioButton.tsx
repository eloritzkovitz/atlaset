interface RadioButtonProps {
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
  name: string;
  label?: string;
  className?: string;
}

/** Renders a styled radio button component. */
export function RadioButton({
  checked,
  disabled,
  onChange,
  name,
  label,
  className = "",
}: RadioButtonProps) {
  return (
    <label
      className={`inline-flex items-center cursor-pointer relative select-none ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <input
        type="radio"
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="peer sr-only"
      />
      <span
        className={`
          w-5 h-5 rounded-full transition-all border-2 flex items-center justify-center
          border-muted bg-transparent
          hover:border-muted-hover
          peer-checked:border-primary
          ${disabled ? "bg-muted border-muted cursor-not-allowed opacity-50" : ""}
        `}
      >
        <span
          className={`
            w-2.5 h-2.5 rounded-full bg-primary transition-transform duration-150
            ${checked ? "scale-100" : "scale-0"}
            ${disabled ? "bg-muted-hover" : ""}
          `}
        />
      </span>

      {label && (
        <span
          className={`ms-2 text-sm font-semibold ${disabled ? "text-muted" : ""}`}
        >
          {label}
        </span>
      )}
    </label>
  );
}
