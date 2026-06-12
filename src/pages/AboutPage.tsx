import { usePageTitle } from "@hooks";

export default function AboutPage() {
  usePageTitle("About Atlaset | Atlaset");

  return (
    <main dir="ltr" className="w-full max-w-6xl mx-auto py-16 px-4 flex flex-col text-start">
      <div className="flex flex-col gap-3 mb-8">
        <h1
          className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight drop-shadow-sm"
          style={{ fontSize: "6rem" }}
        >
          About Atlaset
        </h1>
      </div>
      <p className="text-4xl text-muted mb-12 max-w-4xl">
        Atlaset came out from a longtime dream of mine. As an avid traveler, I
        wanted to create a tool that would help me and my family track and
        revisit our travels in an intuitive and interactive way.
      </p>
      <p className="text-4xl text-muted mb-12 max-w-4xl">
        With Atlaset, you can have your own personalized experience!
      </p>
      <p className="text-4xl text-muted mb-12 max-w-4xl">
        Created by{" "}
        <a
          href="https://github.com/eloritzkovitz"
          className="underline hover:text-primary"
          target="_blank"
          rel="noopener noreferrer"
        >
          Elor Itzkovitz
        </a>
      </p>
    </main>
  );
}
