import { useState, type InputHTMLAttributes } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { FormField } from "./FormField";

interface PasswordFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: string;
  hideLabel?: boolean;
  className?: string;
  status?: React.ReactNode;
}

/** Form field for password input with show/hide toggle.
 * @param label - The label for the password field (default: "Password")
 * @param hideLabel - Whether to visually hide the label (default: false)
 * @param className - Additional CSS classes for the input element
 * @param status - Optional status message (e.g. for validation errors)
 * @param inputProps - Other standard input props (e.g. value, onChange)
 */
export function PasswordField({
  label = "Password",
  hideLabel = false,
  className = "",
  status,
  ...inputProps
}: PasswordFieldProps) {
  const [show, setShow] = useState(false);

  const content = (
    <div className={`relative${hideLabel ? " w-full" : ""}`}>
      <input
        type={show ? "text" : "password"}
        className={`w-full pr-10 ${className}`}
        {...inputProps}
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-muted-hover"
        onClick={() => setShow((v) => !v)}
        tabIndex={-1}
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <FaEyeSlash /> : <FaEye />}
      </button>
      {status && <div className="mt-1 text-xs text-danger">{status}</div>}
    </div>
  );
  return hideLabel ? content : <FormField label={label}>{content}</FormField>;
}
