import { useId } from "react";

interface CheckboxProps {
  id?: string;
  name?: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  onClick?: React.MouseEventHandler<HTMLInputElement>;
  color?: string;
}

/** Renders a styled checkbox component. */
export function Checkbox({
  id,
  name,
  checked,
  disabled,
  onChange,
  label,
  color,
}: CheckboxProps) {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <label
      htmlFor={inputId}
      className="inline-flex items-center cursor-pointer relative select-none"
      onClick={(e) => e.stopPropagation()}
    >
      <input
        id={inputId}
        name={name || inputId}
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
          ${
            color
              ? ""
              : "peer-checked:border-primary peer-checked:bg-primary peer-checked:hover:border-primary-hover peer-checked:hover:bg-primary-hover"
          }
          ${disabled ? "bg-muted border-muted" : ""}
        `}
        style={
          color && checked
            ? {
                borderColor: color,
                background: color,
              }
            : undefined
        }
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
      {label && <span className="ms-2">{label}</span>}
    </label>
  );
}
