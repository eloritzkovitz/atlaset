import { Link } from "react-router-dom";
import { Card } from "@components";
import React from "react";

export interface StatItem {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  link: string;
}

interface StatsGridProps {
  stats: StatItem[];
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <Link
          to={stat.link}
          key={stat.label}
          className="group"
          tabIndex={0}
          aria-label={`Go to ${stat.label}`}
        >
          <Card
            className="cursor-pointer w-full h-full min-h-[220px] min-w-0 flex flex-col items-center justify-between p-6 sm:p-8 rounded-xl shadow-lg text-center font-sans hover:bg-primary/50 hover:scale-105 transition"
            title={stat.label}
            ariaLabel={`Go to ${stat.label}`}
          >
            {stat.icon}
            <div className="mt-4 text-xl font-semibold">{stat.label}</div>
            <div className="mt-2 text-2xl font-bold text-muted">
              {stat.value}
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}