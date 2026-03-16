export type InvestmentInput = {
  currentSavings: number;
  monthlySavings: number;
  expectedReturnRate: number;
  inflationRate: number;
  timeHorizonYears: number;
  annuityType: 'ordinary' | 'due';
  targetAmount: number;
};

export type ChartDataPoint = {
  year: number;
  nominalValue: number;
  realValue: number;
  noInvestment: number;
  conservative: number;
  aggressive: number;
};

export type Recommendation = {
  type: 'increaseMonthlySavings' | 'increaseReturnRate' | 'extendTimeHorizon';
  value: number;
  text: string;
}

export type CalculationResult = {
  chartData: ChartDataPoint[];
  finalNominalValue: number;
  finalRealValue: number;
  totalInvestment: number;
  totalInterest: number;
  targetAmount: number;
  isTargetMet: boolean;
  recommendations: Recommendation[];
  realRateIsNegative: boolean;
  inflationRate: number;
};
