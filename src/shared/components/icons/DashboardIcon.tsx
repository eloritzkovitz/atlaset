import React from "react";

/** Renders a dashboard icon composed of four evenly spaced rounded squares in a 2x2 grid. */
export function DashboardIcon({
  color = "currentColor",
  size = "1em",
  ...props
}: React.SVGProps<SVGSVGElement> & { size?: string | number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="3" y="3" width="8" height="8" rx="2.5" fill={color} />
      <rect x="13" y="3" width="8" height="8" rx="2.5" fill={color} />
      <rect x="3" y="13" width="8" height="8" rx="2.5" fill={color} />
      <rect x="13" y="13" width="8" height="8" rx="2.5" fill={color} />
    </svg>
  );
}
