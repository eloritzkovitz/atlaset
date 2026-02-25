/** Represents a row in the monthly statistics table. */
export type MonthRow = {
  name: string;
  local: number;
  abroad: number;
  total: number;
  percentage: number;
};

/** Represents a row in the yearly statistics table. */
export type YearRow = {
  year: number;
  local: number;
  abroad: number;
  total: number;
};
