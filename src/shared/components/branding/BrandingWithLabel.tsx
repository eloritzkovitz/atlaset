import { Branding } from "./Branding";

export function BrandingWithLabel() {
  return (
    <header className="flex flex-start items-center mt-2 ms-8">
      <Branding size={56} />
      <h2 className="text-4xl font-bold text-blue-800 dark:text-gray-100 ms-1 mt-4">
        Atlaset
      </h2>
    </header>
  );
}
