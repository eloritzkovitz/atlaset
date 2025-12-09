import React from "react";

interface SecurityInfoRowProps {
  label: string;
  value: React.ReactNode;
}

export function SecurityInfoRow({ label, value }: SecurityInfoRowProps) {
  return (
    <li className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl bg-gray-300 dark:bg-gray-600">
      <span className="font-medium text-gray-700 dark:text-gray-200">
        {label}
      </span>
      <span className="text-gray-500 dark:text-gray-400">{value}</span>
    </li>
  );
}
