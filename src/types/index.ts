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

export type Currency = 'IDR' | 'USD';

export type PositionSizingInput = {
    accountBalance: number;
    positionValue: number;
    entryPrice: number;
    stopLossPrice: number;
    takeProfitPrice: number;
};

export type ScenarioResult = {
    wins: number;
    losses: number;
    totalProfit: number;
    totalLoss: number;
    netOutcome: number;
};

export type DrawdownResult = {
    trades: number;
    lossAmount: number;
    remainingCapital: number;
};

export type PositionSizingResult = {
    rrRatio: number;
    positionSize: number;
    potentialProfit: number;
    potentialLoss: number;
    breakevenWinRate: number;
    series30wr: ScenarioResult;
    series40wr: ScenarioResult;
    series50wr: ScenarioResult;
    drawdownSeries: DrawdownResult[];
    accountBalance: number;
    totalPositionValue: number;
};
