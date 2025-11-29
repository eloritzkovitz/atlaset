export type Option<T = string, L = React.ReactNode> = {
  value: T;
  label: L;
};

export type OptionGroup<T> = {
  label: string;
  options: Option<T>[];
};

export type DropdownOption<T> = Option<T> | OptionGroup<T>;
