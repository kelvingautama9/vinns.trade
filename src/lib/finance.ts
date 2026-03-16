import type { ChartDataPoint, InvestmentInput } from '@/types';

/**
 * Helper function to calculate the Future Value (FV) of a lump sum.
 */
function calculateFvLumpSum(pv: number, rate: number, periods: number): number {
  return pv * Math.pow(1 + rate, periods);
}

/**
 * Helper function to calculate the Future Value (FV) of an annuity.
 */
function calculateFvAnnuity(
  payment: number,
  rate: number,
  periods: number,
  type: 'ordinary' | 'due'
): number {
  if (rate === 0) {
    return payment * periods;
  }
  const fv = payment * ((Math.pow(1 + rate, periods) - 1) / rate);
  return type === 'due' ? fv * (1 + rate) : fv;
}

export function calculateInvestmentGrowth(
  input: InvestmentInput
): ChartDataPoint[] {
  const {
    currentSavings,
    monthlySavings,
    expectedReturnRate,
    inflationRate,
    timeHorizonYears,
    annuityType,
  } = input;

  const annualNominalRateDecimal = expectedReturnRate / 100;
  const annualInflationRateDecimal = inflationRate / 100;
  
  // Fisher Equation
  const annualRealRate = (1 + annualNominalRateDecimal) / (1 + annualInflationRateDecimal) - 1;

  const monthlyNominalRate = Math.pow(1 + annualNominalRateDecimal, 1 / 12) - 1;
  const monthlyRealRate = Math.pow(1 + annualRealRate, 1 / 12) - 1;

  const results: ChartDataPoint[] = [];

  for (let year = 0; year <= timeHorizonYears; year++) {
    const months = year * 12;

    // Calculate Nominal Value
    const fvLumpSumNominal = calculateFvLumpSum(currentSavings, monthlyNominalRate, months);
    const fvAnnuityNominal = calculateFvAnnuity(monthlySavings, monthlyNominalRate, months, annuityType);
    const nominalValue = fvLumpSumNominal + fvAnnuityNominal;

    // Calculate Real Value
    const fvLumpSumReal = calculateFvLumpSum(currentSavings, monthlyRealRate, months);
    const fvAnnuityReal = calculateFvAnnuity(monthlySavings, monthlyRealRate, months, annuityType);
    const realValue = fvLumpSumReal + fvAnnuityReal;

    results.push({
      year,
      nominalValue,
      realValue,
    });
  }

  return results;
}
