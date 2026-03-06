/** Renders a visit icon as a location pin with a circular center. */
export function VisitIcon({
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
      <path
        d="M12 2C7.58 2 4 5.58 4 10c0 4.42 4.13 8.97 7.13 11.36a1.5 1.5 0 0 0 1.74 0C15.87 18.97 20 14.42 20 10c0-4.42-3.58-8-8-8zm0 2c3.31 0 6 2.69 6 6 0 3.31-2.69 6-6 6s-6-2.69-6-6c0-3.31 2.69-6 6-6zm0 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"
        fill={color}
      />
    </svg>
  );
}
