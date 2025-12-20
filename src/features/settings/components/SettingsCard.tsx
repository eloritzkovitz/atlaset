import { Card } from "@components";
import React from "react";

interface SettingsCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function SettingsCard({ title, icon, children }: SettingsCardProps) {
  return (
    <Card className="mb-6 w-full">
      <div className="flex items-center gap-2 mb-4">
        {icon && <span className="text-xl">{icon}</span>}
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      </div>
      <div>{children}</div>
    </Card>
  );
}
