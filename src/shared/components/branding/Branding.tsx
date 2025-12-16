import { Link } from "react-router-dom";
import { useTheme } from "@features/settings";

interface BrandingProps {
  title?: string;
  size?: number;
}

export function Branding({ title, size = 48 }: BrandingProps) {
  const { theme } = useTheme();

  // Light theme colors
  const lightBg = "#2b3990";
  const lightFg = "#262262";

  // Dark theme colors
  const darkBg = "#f1f2f2";
  const darkFg = "#e6e7e8";

  // Select colors based on theme
  const bgColor = theme === "dark" ? darkBg : lightBg;
  const fgColor = theme === "dark" ? darkFg : lightFg;

  return (
    <Link
      to="/"
      aria-label={title ? `Go to home page (${title})` : "Go to home page"}
      className="flex items-center gap-2 focus:outline-none focus:ring-none"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 129.87 144.88"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="inline-block"
      >
        <path
          fill={bgColor}
          d="M90.65,48.58c-3.19-6.71-8.38-12.66-14.12-16.75-6.05-4.31-14.67-6.95-22.67-4.95l-20.37,44.43c13.37-4.43,19.67-.13,27.37,7.57s10.93,15.87,14.79,20.87c0,0,14.88-32,18.23-39.22-.25-4.09-1.42-8.14-3.23-11.95Z"
        />
        <path
          fill={fgColor}
          d="M116.87,115.88c-6.03-.29-7.07-.61-11-3-2.05-1.25-3.66-3.21-5.22-4.99-1.81-2.06-3.35-4.23-4.74-6.6-.24-.4-.47-.81-.7-1.22-.43-.8-.83-1.62-1.11-2.49-.14-.42-.24-.86-.3-1.3-.03-.21-.04-.43-.04-.64,0-.15-.01-.29,0-.44,0-.07,0-.14.02-.21.01-.05,0-.13.06-.18.13.09.25.17.39.25.16.08.31.17.46.25.31.17.61.35.92.53.47.27.93.57,1.43.77,1.51.6,3.11.95,4.72,1.17.43.06.87.06,1.31.09,1.66.11,3.32.09,4.98-.05.85-.07,1.71-.18,2.55-.33,3.98-.68,7.7-2.36,10.83-4.95.78-.64,1.42-1.4,2.15-2.09.66-.63.97-1.34,1.56-2.03-3.21,1.63-10.81,1.61-14.25.47-3-1-3.12-1.18-6-3-4.28-2.71-8.15-7.66-9.06-12.81-.55-3.12-.62-6.28-.44-9.43,0,0-17.95,38.59-17.94,38.61.77,3.61,6.75,10.3,9.44,12.64,4.29,3.74,10.41,7.07,16,8,6,1,14.91-1.14,18-3,5-3,4.62-3.5,8-7.36-2.14,2.45-9.29,3.49-12,3.36Z"
        />
        <rect
          fill={fgColor}
          x="48.89"
          y="4.64"
          width="13.65"
          height="10.01"
          rx="5"
          ry="5"
          transform="translate(9.26 -22.59) rotate(24.93)"
        />
        <path
          fill={fgColor}
          d="M49.54,14.3L1.3,118.08l-.16.35c-.1.25-.17.51-.22.76-.27,1.57.5,3.19,2.01,3.91,1.53.73,3.32.29,4.36-.95.18-.21.33-.43.46-.68l.1-.21L56.14,17.37l-6.6-3.07Z"
        />
      </svg>
      {title ? (
        <span className="font-bold text-lg dark:text-gray-200">{title}</span>
      ) : null}
    </Link>
  );
}
