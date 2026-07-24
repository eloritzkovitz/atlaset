import { ActionButton, MenuButton, Separator } from "@components";
import type { ToolbarActionItem } from "../../hooks/useToolbarActions";

interface MapToolbarActionsProps {
  actions: ToolbarActionItem[];
  isDesktop: boolean;
  orientation?: "horizontal" | "vertical";
  children?: React.ReactNode;
}

export function MapToolbarActions({
  actions,
  isDesktop,
  orientation = "vertical",
  children,
}: MapToolbarActionsProps) {
  if (isDesktop) {
    return (
      <>
        {actions
          .filter((a) => a.show)
          .map((action) => [
            <ActionButton
              key={action.key}
              onClick={action.onClick}
              ariaLabel={action.label}
              title={action.label}
              titlePosition={orientation === "vertical" ? "left" : "top"}
              icon={action.icon}
              variant="action"
              shortcut={action.commandId}
              rounded
            />,
            action.separatorAfter ? (
              <Separator
                key={action.key + "-sep"}
                orientation={
                  orientation === "vertical" ? "horizontal" : "vertical"
                }
                className="mx-2 h-6"
              />
            ) : null,
          ])}
        {children}
      </>
    );
  }

  // Mobile
  return (
    <>
      {actions
        .filter((a) => a.show)
        .map((action) => (
          <MenuButton
            key={action.key}
            onClick={action.onClick}
            icon={action.icon}
            ariaLabel={action.label}
            title={action.label}
          >
            {action.label}
          </MenuButton>
        ))}
      {children}
    </>
  );
}
