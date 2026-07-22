import React from "react";
import { useScreenSize } from "@hooks";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

/** Renders a responsive max-width container for page content. */
export function Container({ children, className = "" }: ContainerProps) {
  const { isLaptop } = useScreenSize();

  // Determine the maximum width class based on screen size
  const widthClass = isLaptop ? "max-w-4xl" : "max-w-6xl";

  return (
    <div
      className={`mx-auto w-full p-4 ${widthClass} ${className}`}
    >
      {children}
    </div>
  );
}
