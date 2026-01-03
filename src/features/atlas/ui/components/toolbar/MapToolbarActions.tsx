import { ActionButton, ToolbarSeparator, MenuButton } from "@components";

interface MapToolbarActionsProps {
  actions: {
    key: string;
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    show?: boolean;
    separatorAfter?: boolean;
  }[];
  isDesktop: boolean;
  children?: React.ReactNode;
}

export function MapToolbarActions({
  actions,
  isDesktop,
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
              titlePosition="top"
              icon={action.icon}
              variant="action"
              rounded
            />,
            action.separatorAfter ? (
              <ToolbarSeparator key={action.key + "-sep"} />
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
