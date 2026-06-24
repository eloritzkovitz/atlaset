import { Link } from "react-router-dom";
import { Tooltip } from "../ui/Tooltip/Tooltip";

interface MenuButtonProps {
  url?: string;
  type?: "button" | "submit" | "reset";
  variant?: "default" | "sidebar";
  icon: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
  title?: string;
  onClick?: () => void;
  onMouseDown?: () => void;
  onPointerDown?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function MenuButton({
  url,
  type = "button",
  variant = "default",
  icon,
  children,
  active = false,
  className = "",
  disabled,
  ariaLabel,
  title,
  onClick,
  onMouseDown,
  onPointerDown,
  onMouseEnter,
  onMouseLeave,
}: MenuButtonProps) {
  const baseClass =
    `rounded-lg text-left !text-text font-semibold px-2 py-2 flex items-center gap-2 ` +
    (active
      ? "bg-primary dark:bg-primary/70 !text-white font-semibold "
      : variant === "sidebar"
        ? "hover:bg-sidebar-btn-hover "
        : "hover:bg-surface-hover ") +
    className;

  const sharedProps = {
    className: baseClass,
    "aria-label": ariaLabel,
    onClick,
    onMouseEnter,
    onMouseLeave,
    children: (
      <>
        {icon}
        {children}
      </>
    ),
  };

  // Determine if the URL is external (starts with http:// or https://)
  const isExternal = url?.startsWith("http://") || url?.startsWith("https://");

  const content = url ? (
    isExternal ? (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={disabled ? -1 : 0}
        style={disabled ? { pointerEvents: "none", opacity: 0.5 } : undefined}
        {...sharedProps}
      />
    ) : (
      <Link
        to={url}
        tabIndex={disabled ? -1 : 0}
        style={disabled ? { pointerEvents: "none", opacity: 0.5 } : undefined}
        {...sharedProps}
      />
    )
  ) : (
    <button
      type={type}
      onMouseDown={onMouseDown}
      onPointerDown={onPointerDown}
      disabled={disabled}
      {...sharedProps}
    />
  );

  return title ? (
    <Tooltip content={title} position="top">
      {content}
    </Tooltip>
  ) : (
    content
  );
}
