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
  expectedReturnRate: number;
  inflationRate: number;
};


export type RiskRewardInput = {
    capital: number;
    riskPerTrade: number;
    winRate: number;
    riskRewardRatio: number;
}

export type RiskRewardResult = {
    riskRewardRatio: number;
    nominalExpectancy: number;
    expectancyRatio: number;
    status: "POSITIVE EDGE / VALIDATED" | "NEGATIVE EDGE / HIGH RISK";
    message: string;
    riskAmount: number;
    avgWin: number;
    winRate: number;
}
