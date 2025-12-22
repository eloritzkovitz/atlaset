import { Branding } from "../Branding/Branding";

export function BrandingWithLabel() {
  return (
    <header className="flex flex-start items-center mt-2 ml-8">
      <Branding size={56} />
      <h2 className="text-4xl font-bold text-blue-800 dark:text-gray-100 ml-1 mt-4">
        Atlaset
      </h2>
    </header>
  );
}
