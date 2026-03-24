import React from "react";

interface SecurityInfoRowProps {
  label: React.ReactNode;
  value: React.ReactNode;
}

export function SecurityInfoRow({ label, value }: SecurityInfoRowProps) {
  return (
    <li className="flex flex-col md:flex-row md:items-center bg-surface dark:bg-surface-alt justify-between p-4 rounded-xl">
      <span className="font-medium">{label}</span>
      <span className="text-muted">{value}</span>
    </li>
  );
}
