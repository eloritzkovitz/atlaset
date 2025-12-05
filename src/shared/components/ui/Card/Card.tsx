import React from "react";

interface CardProps {
  className?: string;
  children: React.ReactNode;
  loading?: boolean;
  skeletonLines?: number;
}

export function Card({
  className = "",
  children,
  loading = false,
  skeletonLines = 3,
}: CardProps) {
  if (loading) {
    return (
      <div
        className={`bg-gray-50 dark:bg-gray-800 rounded-2xl shadow p-5 animate-pulse ${className}`}
      >
        {Array.from({ length: skeletonLines }).map((_, idx) => (
          <div
            key={idx}
            className={`h-5 w-${
              idx === 0 ? "3/4" : "full"
            } bg-gray-200 dark:bg-gray-700 rounded-full mb-3`}
          />
        ))}
      </div>
    );
  }
  return (
    <div
      className={`bg-gray-50 dark:bg-gray-800 rounded-2xl shadow p-5 ${className}`}
    >
      {children}
    </div>
  );
}
