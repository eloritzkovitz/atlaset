interface SwitchProps {
  variant?: "surface" | "input";
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

/** Renders a switch component. */
export function Switch({
  variant = "surface",
  checked,
  onChange,
  disabled = false,
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`
        relative w-12 h-6 flex items-center rounded-full transition-colors focus:outline-none
        ${checked ? "bg-primary" : "bg-" + variant}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      <span
        className={`
          absolute w-5 h-5 bg-text rounded-full transition-transform duration-300 flex items-center justify-center
          ${checked ? "translate-x-6 rtl:-translate-x-6" : "translate-x-0"}
        `}
      />
    </button>
  );
}
