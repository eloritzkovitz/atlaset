import { Menu, MenuButton } from "@components";
import { RATING_ACTION_OPTIONS } from "@features/trips/constants/trips";
import { StarRatingInput } from "./StarRatingInput";

interface RateMenuProps {
  open: boolean;
  menuStyle: React.CSSProperties;
  menuRef: React.RefObject<HTMLDivElement | null>;
  hoverHandlers: any;
  onRate: (value: number) => void;
}

export function RateMenu({
  open,
  menuStyle,
  menuRef,
  hoverHandlers,
  onRate,
}: RateMenuProps) {
  return (
    <Menu
      open={open}
      className="rate-menu w-full"
      style={menuStyle}
      containerRef={menuRef}
      {...hoverHandlers}
    >
      {RATING_ACTION_OPTIONS.map((opt) => (
        <MenuButton
          key={opt.value}
          onClick={() => opt.value !== undefined && onRate(opt.value)}
          icon={
            <span className="flex items-center">
              <StarRatingInput value={opt.value} readOnly />
            </span>
          }
          className="w-full"
        >
          {opt.label}
        </MenuButton>
      ))}
    </Menu>
  );
}
