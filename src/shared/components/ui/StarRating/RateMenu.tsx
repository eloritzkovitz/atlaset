import { Menu, MenuButton } from "@components";
import { RATING_ACTION_OPTIONS } from "@features/trips/constants/trips";
import { StarRatingInput } from "./StarRatingInput";

interface RateMenuProps {
  open: boolean;
  menuStyle: React.CSSProperties;
  menuRef: React.RefObject<HTMLDivElement | null>;
  hoverHandlers: React.HTMLAttributes<HTMLDivElement>;
  onRate: (value: number) => void;
  onClose: () => void;
}

export function RateMenu({
  open,
  menuStyle,
  menuRef,
  hoverHandlers,
  onRate,
  onClose,
}: RateMenuProps) {
  return (
    <Menu
      open={open}
      className="rate-menu w-full"
      style={menuStyle}
      containerRef={menuRef}
      onClose={onClose}
    >
      <div {...hoverHandlers}>
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
      </div>
    </Menu>
  );
}
