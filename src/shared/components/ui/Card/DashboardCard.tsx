import React from "react";

interface DashboardCardProps {
  icon?: React.ElementType;
  iconClass?: string;
  title: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
}

export function DashboardCard({
  icon: Icon,
  iconClass = "",
  title,
  subtitle,
  className = "",
  children,
}: DashboardCardProps) {
  return (
    <div
      className={`bg-gray-50 dark:bg-gray-800 rounded-2xl shadow p-5 ${className}`}
    >
      <div className="flex items-center gap-3 mb-2">
        {Icon && <Icon className={`text-2xl ${iconClass}`} />}
        <div>
          <div className="font-semibold text-lg">{title}</div>
          {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
        </div>
      </div>
      {children}
    </div>
  );
}
