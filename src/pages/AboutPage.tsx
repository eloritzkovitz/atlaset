import { Branding } from "@components";
import { usePageTitle } from "@hooks";

export default function AboutPage() {
  usePageTitle("About Atlaset | Atlaset");

  return (
    <main className="w-full max-w-2xl mx-auto py-16 px-4 flex flex-col items-center text-center">
      <div className="flex flex-col items-center gap-3 mb-8">
        <span className="w-30 h-30 inline-block">
          <Branding size={120} />
        </span>
        <h1 className="text-4xl font-extrabold drop-shadow-sm">
          About Atlaset
        </h1>
      </div>
      <p className="text-lg text-muted mb-12 max-w-xl">
        Welcome to Atlaset, a modern and interactive, fully-configurable country
        explorer and travel tracker.
      </p>
      <div className="w-full flex flex-col gap-6 mb-8 items-center text-center">
        <section>
          <h2 className="text-2xl font-bold mb-2">Mission</h2>
          <p className="text-lg text-muted mb-12">
            As an avid traveler, I created Atlaset to document my own journeys
            in a fun and engaging way.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-2">Open Source</h2>
          <p className="text-lg text-muted mb-12">
            Atlaset is open source and available on{" "}
            <a
              href="https://github.com/eloritzkovitz/atlaset"
              className="text-primary underline"
            >
              GitHub
            </a>
            . Feedback and ideas are always welcome!
          </p>
        </section>
      </div>
      <div className="text-lg text-muted text-center mt-8">
        Made by{" "}
        <a
          href="https://github.com/eloritzkovitz"
          className="underline hover:text-primary"
          target="_blank"
          rel="noopener noreferrer"
        >
          Elor Itzkovitz
        </a>
      </div>
    </main>
  );
}
