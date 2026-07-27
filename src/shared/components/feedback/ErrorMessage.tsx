import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

interface ErrorMessageProps {
  error: SerializedError | FetchBaseQueryError | string | Error | unknown;
  fullScreen?: boolean;
}

/**
 * Safely extracts a human-readable string from RTK Query errors,
 * standard Errors, strings, or unknown objects.
 */
function getErrorMessage(error: unknown): string {
  if (!error) return "An unknown error occurred";

  // Standard Error object
  if (typeof error === "string") return error;

  // SerializedError from Redux Toolkit
  if (
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  // RTK Query FetchBaseQueryError
  if (typeof error === "object" && "status" in error) {
    const fetchError = error as FetchBaseQueryError;

    if (
      "data" in fetchError &&
      fetchError.data &&
      typeof fetchError.data === "object"
    ) {
      const data = fetchError.data as Record<string, unknown>;
      if (typeof data.message === "string") return data.message;
      if (typeof data.error === "string") return data.error;
    }

    if ("error" in fetchError && typeof fetchError.error === "string") {
      return fetchError.error;
    }

    return `Request failed with status ${fetchError.status}`;
  }

  return "An unexpected error occurred";
}

/** Displays a user-friendly error message based on the type of error provided. */
export function ErrorMessage({ error, fullScreen = false }: ErrorMessageProps) {
  const message = getErrorMessage(error);

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
        <div
          className="text-danger px-6 py-5 rounded-xl shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
          role="alert"
        >
          <strong className="font-bold">Error:</strong>{" "}
          <span className="block mt-2">{message}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="text-danger px-4 py-3 rounded mb-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900"
      role="alert"
    >
      <strong className="font-bold">Error:</strong>{" "}
      <span className="block mt-1">{message}</span>
    </div>
  );
}
