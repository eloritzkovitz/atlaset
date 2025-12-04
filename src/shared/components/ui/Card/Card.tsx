import React from "react";

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export function Card({
  className = "",
  children,
}: CardProps) {
  return (
    <div
      className={`bg-gray-50 dark:bg-gray-800 rounded-2xl shadow p-5 ${className}`}
    >
      {children}
    </div>
  );
}
