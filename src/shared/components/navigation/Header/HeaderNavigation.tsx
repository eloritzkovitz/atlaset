import { useScreenSize } from "@hooks";
import { NavigationButton, type NavigationItem } from "./NavigationButton";

interface HeaderNavigationProps {
  previous?: NavigationItem;
  next?: NavigationItem;
}

export function HeaderNavigation({ previous, next }: HeaderNavigationProps) {
  const { isMobile } = useScreenSize();

  if (!previous && !next) {
    return null;
  }

  return (
    <div className="mb-4 flex items-center justify-between">
      {previous ? (
        <NavigationButton
          item={previous}
          direction="prev"
          isMobile={isMobile}
        />
      ) : (
        <div />
      )}

      {next ? (
        <NavigationButton item={next} direction="next" isMobile={isMobile} />
      ) : (
        <div />
      )}
    </div>
  );
}
