interface BackdropProps {
  onClick?: () => void;
  className?: string;
}

/** Renders a backdrop component for overlay elements. */
export function Backdrop({ onClick, className = "" }: BackdropProps) {
  return (
    <div
      className={`fixed inset-0 bg-black/40 ${className}`}
      onClick={onClick}
      aria-hidden="true"
    />
  );
}
