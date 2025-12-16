import { BrandFooter, BrandHeader } from "@components";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-between">
      <BrandHeader />
      {/* Main content */}
      <main className="flex flex-col items-center flex-1 justify-center">
        <h1 className="text-6xl font-extrabold text-blue-800 dark:text-blue-400 mb-4 drop-shadow">
          404
        </h1>
        <p className="text-2xl text-gray-700 dark:text-gray-200 mb-2">
          Oops! Page not found.
        </p>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-center max-w-md">
          The page you are looking for doesn&apos;t exist or has been moved.
          <br />
          Please check the URL or return to the homepage.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 rounded-xl bg-blue-700 text-white font-semibold shadow hover:bg-blue-800 transition"
        >
          Go Home
        </a>
      </main>
      <BrandFooter />
    </div>
  );
}
