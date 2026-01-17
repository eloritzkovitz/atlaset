export interface SubregionStat {
  name: string;
  visited: number;
  total: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  type: string;
  criteria: any;
  icon: string;
}
