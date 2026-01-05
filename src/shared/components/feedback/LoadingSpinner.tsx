interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({
  message,
  fullScreen = false,
}: LoadingSpinnerProps) {
  const containerClass = fullScreen
    ? "fixed inset-0 z-[1000] flex flex-col items-center justify-center"
    : "flex flex-col items-center justify-center py-8";
  return (
    <div className={containerClass}>
      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600 border-solid mb-4"></div>
      {message && (
        <div className="text-xl text-blue-700 dark:text-gray-200 font-semibold">
          {message}
        </div>
      )}
    </div>
  );
}
