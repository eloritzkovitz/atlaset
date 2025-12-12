export function ErrorMessage({ error }: { error: string | Error }) {
  return (
    <div className="text-danger px-4 py-3 rounded mb-4" role="alert">
      <strong className="font-bold">Error:</strong>{" "}
      <span className="block">{typeof error === "string" ? error : error.message}</span>
    </div>
  );
}