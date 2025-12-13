import React from "react";

interface DashboardCardProps {
  icon?: React.ElementType;
  iconClass?: string;
  title: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
  loading?: boolean;
}

export function DashboardCard({
  icon: Icon,
  iconClass = "",
  title,
  subtitle,
  className = "",
  children,
  loading = false,
}: DashboardCardProps) {
  if (loading) {
    return (
      <>
        {/* Loading Skeleton */}
        <div
          className={`bg-surface-alt rounded-2xl shadow p-5 animate-pulse ${className}`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-input rounded-full" />
            <div>
              <div className="h-5 w-32 bg-input rounded mb-2" />
              <div className="h-3 w-20 bg-input rounded" />
            </div>
          </div>
          <div className="h-6 w-full bg-input rounded mt-4" />
          <div className="h-6 w-2/3 bg-input rounded mt-2" />
        </div>
      </>
    );
  }
  return (
    <div
      className={`bg-surface-alt rounded-2xl shadow p-5 ${className}`}
    >
      <div className="flex items-center gap-3 mb-2">
        {Icon && <Icon className={`text-2xl ${iconClass}`} />}
        <div>
          <div className="font-semibold text-lg">{title}</div>
          {subtitle && <div className="text-xs text-muted">{subtitle}</div>}
        </div>
      </div>
      {children}
    </div>
  );
}
