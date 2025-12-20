import { useRef } from "react";
import { FaRegCalendar } from "react-icons/fa6";
import { InputBox } from "../InputBox/InputBox";
import "./DateSelect.css";

interface DateSelectProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
}

export function DateSelect({
  label,
  className = "",
  ...props
}: DateSelectProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={className}>
      {label && <label className="block mb-1 font-medium">{label}</label>}
      <div className="relative">
        <InputBox ref={inputRef} type="date" {...props} />
        <FaRegCalendar
          className="w-4 h-4 text-muted absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
          onClick={() =>
            inputRef.current?.showPicker?.() || inputRef.current?.focus()
          }
        />
      </div>
    </div>
  );
}
