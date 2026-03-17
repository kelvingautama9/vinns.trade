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


export type PositionSizingInput = {
    totalCapital: number;
    riskPerTrade: number; // percentage, e.g. 1 for 1%
    entryPrice: number;
    stopLossPrice: number;
    takeProfitPrice: number;
};

export type PositionSizingResult = {
    totalProfit: number;
    totalRisk: number;
    riskRewardRatio: number;
    positionSize: number;
    breakevenWinRate: number; // percentage
    recoveryFactor: number; // percentage
};
