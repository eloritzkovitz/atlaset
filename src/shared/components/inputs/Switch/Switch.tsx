import { useLanguage } from "@features/settings";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

/** Renders a switch component. */
export function Switch({ checked, onChange, disabled = false }: SwitchProps) {
  const { isRtl } = useLanguage();

  const knobClasses =
    "absolute w-5 h-5 bg-bg rounded-full transition-transform duration-300 flex items-center justify-center ";
  const positionClass = isRtl
    ? checked
      ? "-translate-x-6 shadow"
      : "translate-x-0"
    : checked
      ? "translate-x-6 shadow"
      : "translate-x-0";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`
        relative w-12 h-6 flex items-center rounded-full transition-colors focus:outline-none
        ${checked ? "bg-primary" : "bg-surface"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      <span className={knobClasses + positionClass} />
    </button>
  );
}
