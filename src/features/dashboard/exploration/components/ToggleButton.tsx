import { type JSX } from "react";
import { ActionButton } from "@components";

export function ToggleButton({
  on,
  onClick,
  ariaLabelOn,
  ariaLabelOff,
  titleOn,
  titleOff,
  iconOn,
  iconOff,
}: {
  on: boolean;
  onClick: () => void;
  ariaLabelOn: string;
  ariaLabelOff: string;
  titleOn: string;
  titleOff: string;
  iconOn: JSX.Element;
  iconOff: JSX.Element;
}) {
  return (
    <ActionButton
      onClick={onClick}
      ariaLabel={on ? ariaLabelOn : ariaLabelOff}
      title={on ? titleOn : titleOff}
      icon={
        <span className="flex items-center gap-1 font-semibold text-sm">
          {on ? iconOn : iconOff}
        </span>
      }
      variant="toggle"
      rounded
    />
  );
}
