
import { clamp } from "@utils/number";
import { ArrowButton } from "../../buttons/ArrowButton";
import { InputBox } from "../InputBox/InputBox";
import "./NumberInput.css";

interface NumberInputProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  className?: string;
}

export function NumberInput({
  label,
  value,
  min,
  max,
  onChange,
  className = "",
}: NumberInputProps) {
  return (
    <div className={`my-4 ${className}`}>
      {label && <label className="font-bold block mb-2">{label}</label>}
      <div className="relative w-full">
        <InputBox
          type="number"
          className="pr-8 w-full h-10 appearance-none focus:ring-2 focus:ring-blue-400 rounded transition"
          value={value}
          min={min}
          max={max}
          onChange={(e: { target: { value: any } }) =>
            onChange(clamp(Number(e.target.value)))
          }
          style={{ MozAppearance: "textfield" }}
        />
        <div className="absolute right-1 top-1 h-10 flex flex-col justify-center">
          <ArrowButton
            onClick={() => onChange(clamp(value + 1))}
            direction="up"
            ariaLabel="Increase"
          />
          <ArrowButton
            onClick={() => onChange(clamp(value - 1))}
            direction="down"
            ariaLabel="Decrease"
          />
        </div>
      </div>
    </div>
  );
}
