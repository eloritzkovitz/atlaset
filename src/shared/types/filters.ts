import type { Option } from "./option";

export type FilterKey = string;

export type FilterOption = Option<string | number, string>;

export type FilterConfig<T = string, P = any, K extends FilterKey = string> = {
  key: K;
  label: string | ((param: P) => string);
  type: "select";
  getOptions: (options?: T[]) => FilterOption[];
  getValue: (props: any, param?: P) => string;
  setValue: (props: any, val: string, param?: P) => void;
};
