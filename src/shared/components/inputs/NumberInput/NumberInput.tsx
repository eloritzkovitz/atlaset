import { useId } from "react";
import { clamp } from "@utils";
import { ArrowButton } from "./ArrowButton";
import { InputBox } from "../InputBox/InputBox";
import "./NumberInput.css";

interface NumberInputProps {
  id?: string;
  name?: string;
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  className?: string;
  disabled?: boolean;
}

/** Renders a number input with increment/decrement buttons. */
export function NumberInput({
  id,
  name,
  label,
  value,
  min,
  max,
  onChange,
  className = "",
  disabled = false,
}: NumberInputProps) {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className={className}>
      {label && <label className="font-bold block mb-2">{label}</label>}
      <div className="relative w-full">
        <InputBox
          id={inputId}
          name={name || inputId}
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange(clamp(Number(e.target.value)))
          }
          style={{ MozAppearance: "textfield" }}
          disabled={disabled}
          className="pe-8 w-full h-10 appearance-none focus:ring-2 focus:ring-ring-focus rounded transition"
        />
        <div className="absolute end-1 top-1 h-10 flex flex-col justify-center">
          <ArrowButton
            onClick={() => onChange(clamp(value + 1))}
            direction="up"
            ariaLabel="Increase"
            disabled={disabled}
          />
          <ArrowButton
            onClick={() => onChange(clamp(value - 1))}
            direction="down"
            ariaLabel="Decrease"
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}
