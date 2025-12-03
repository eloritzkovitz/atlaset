import React from "react";

interface DashboardCardProps {
  className?: string;
  children: React.ReactNode;
}

export function DashboardCard({
  className = "",
  children,
}: DashboardCardProps) {
  return (
    <div
      className={`bg-gray-50 dark:bg-gray-800 rounded-2xl shadow p-5 ${className}`}
    >
      {children}
    </div>
  );
}
