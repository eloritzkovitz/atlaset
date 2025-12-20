import type { Option } from "./option";

export type FilterKey = string;

export type FilterOption = Option<string | number, string>;

export type FilterConfig<
  T = string,
  P = unknown,
  K extends FilterKey = string
> = {
  key: K;
  label: string | ((param: P) => string);
  type: "select";
  getOptions: (options?: T[]) => FilterOption[];
  getValue: (props: P, param?: P) => string;
  setValue: (props: P, val: string, param?: P) => void;
};
