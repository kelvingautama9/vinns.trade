export type InvestmentInput = {
  currentSavings: number;
  monthlySavings: number;
  expectedReturnRate: number;
  inflationRate: number;
  timeHorizonYears: number;
  annuityType: 'ordinary' | 'due';
};

export type ChartDataPoint = {
  year: number;
  nominalValue: number;
  realValue: number;
};

export type CalculationResult = {
  chartData: ChartDataPoint[];
};
