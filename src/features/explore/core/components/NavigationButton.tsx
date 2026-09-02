import type { ReactNode } from "react";
import { ActionButton, DirectionalIcon } from "@components";

export interface ExploreHeaderNavigationItem {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
}

interface NavigationButtonProps {
  item: ExploreHeaderNavigationItem;
  direction: "prev" | "next";
  isMobile: boolean;
}

export function NavigationButton({
  item,
  direction,
  isMobile,
}: NavigationButtonProps) {
  const isPrevious = direction === "prev";

  return (
    <ActionButton
      variant="custom"
      onClick={item.onClick}
      ariaLabel={`${isPrevious ? "Previous" : "Next"}: ${item.label}`}
      className="gap-1 p-0 font-normal hover:text-info"
    >
      {isPrevious && (
        <>
          <DirectionalIcon
            direction="prev"
            variant="arrow"
            className="text-xl transition-transform duration-200 hover:-translate-x-1"
          />
          {item.icon}
        </>
      )}

      {!isMobile && <span>{item.label}</span>}

      {!isPrevious && (
        <>
          {item.icon}
          <DirectionalIcon
            direction="next"
            variant="arrow"
            className="text-xl transition-transform duration-200 hover:translate-x-1"
          />
        </>
      )}
    </ActionButton>
  );
}
