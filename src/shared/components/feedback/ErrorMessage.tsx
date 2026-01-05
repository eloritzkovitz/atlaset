interface ErrorMessageProps {
  error: string | Error;
  fullScreen?: boolean;
}

export function ErrorMessage({ error, fullScreen = false }: ErrorMessageProps) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center">
        <div
          className="text-danger px-6 py-5 rounded-xl shadow-lg bg-white dark:bg-gray-900"
          role="alert"
        >
          <strong className="font-bold">Error:</strong>{" "}
          <span className="block mt-2">
            {typeof error === "string" ? error : error.message}
          </span>
        </div>
      </div>
    );
  }
  return (
    <div className="text-danger px-4 py-3 rounded mb-4" role="alert">
      <strong className="font-bold">Error:</strong>{" "}
      <span className="block">
        {typeof error === "string" ? error : error.message}
      </span>
    </div>
  );
}
