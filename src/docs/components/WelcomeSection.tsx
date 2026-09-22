import { DocsCards } from "./DocsCards";
import { DocSearchDropdown } from "./DocSearchDropdown";

export function WelcomeDocsSection() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 px-2 text-center animate-fade-in sm:px-4">
      <div className="flex w-full flex-col items-center gap-4">
        <h1 className="mb-1 text-2xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
          Atlaset Docs
        </h1>

        <p className="mx-auto text-base font-medium text-muted sm:text-lg md:text-xl">
          Your companion for mastering Atlaset.
        </p>
      </div>

      <div className="mt-8 flex w-full flex-col items-center gap-8">
        <DocSearchDropdown
          className="w-full max-w-6xl"
          placeholder="Search documentation"
        />
        <DocsCards />
      </div>
    </div>
  );
}
