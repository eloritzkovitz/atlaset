/** Renders a dashboard icon composed of four evenly spaced rounded squares. */
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
      <rect x="2" y="2" width="9" height="9" rx="2.5" fill={color} />
      <rect x="13" y="2" width="9" height="9" rx="2.5" fill={color} />
      <rect x="2" y="13" width="9" height="9" rx="2.5" fill={color} />
      <rect x="13" y="13" width="9" height="9" rx="2.5" fill={color} />
    </svg>
  );
}
