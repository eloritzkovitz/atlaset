import type { Option } from "./option";

export type FilterKey = string;

export type FilterOption = Option<string | number, string>;

export type FilterConfig<
  T = unknown,
  P = unknown,
  K extends FilterKey = string
> = {
  key: K;
  label: string | ((option: T) => string);
  type: "select";
  getOptions: (options?: T[]) => FilterOption[];
  getValue: (props: P, param?: T) => string;
  setValue: (props: P, val: string, param?: T) => void;
};
