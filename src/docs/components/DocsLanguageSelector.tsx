import { DropdownSelectInput } from "@components";

interface DocsLanguageSelectorProps {
  value: string;
  onChange: (language: string) => void;
}

const DOCS_LANGUAGES = [
  {
    value: "en",
    label: "English",
  },
];

export function DocsLanguageSelector({
  value,
  onChange,
}: DocsLanguageSelectorProps) {
  return (
    <DropdownSelectInput
      id="docs-language"
      name="docs-language"
      options={DOCS_LANGUAGES}
      value={value}
      onChange={(val: string | string[]) =>
        onChange(Array.isArray(val) ? val[0] : val)
      }
      className="!w-[180px]"
    />
  );
}
