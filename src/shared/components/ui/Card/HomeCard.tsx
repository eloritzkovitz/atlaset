import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ActionButton } from "@components";

interface HomeCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  linkTo: string;
  linkText: string;
}

export function HomeCard({
  icon,
  title,
  description,
  linkTo,
  linkText,
}: HomeCardProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full md:w-80">
      <div className="mb-4">{icon}</div>
      <h2 className="text-xl font-bold mb-2 text-blue-600 dark:text-gray-200">
        {title}
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4 text-center">
        {description}
      </p>
      <ActionButton
        onClick={() => navigate(linkTo)}
        className="px-6 py-3 bg-blue-800 dark:bg-gray-100 text-white dark:text-gray-800 rounded-lg text-lg font-bold hover:bg-blue-900 dark:hover:bg-gray-200 transition-colors"
        ariaLabel={linkText}
        title={linkText}
      >
        {linkText}
      </ActionButton>
    </div>
  );
}
