import type { ChartDataPoint, InvestmentInput, CalculationResult, Recommendation } from '@/types';

// --- Helper Functions for Future Value (FV) Calculations ---

function calculateFvLumpSum(pv: number, rate: number, periods: number): number {
  return pv * Math.pow(1 + rate, periods);
}

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

function calculateTotalFv(pv: number, pmt: number, rate: number, periods: number, type: 'ordinary' | 'due'): number {
    const fvLumpSum = calculateFvLumpSum(pv, rate, periods);
    const fvAnnuity = calculateFvAnnuity(pmt, rate, periods, type);
    return fvLumpSum + fvAnnuity;
}

// --- Recommendation Calculation Helpers ---

function findRequiredMonthlySavings(pv: number, targetFv: number, rate: number, periods: number, type: 'ordinary' | 'due'): number {
    const fvLumpSum = calculateFvLumpSum(pv, rate, periods);
    const requiredFvFromAnnuity = targetFv - fvLumpSum;
    if (requiredFvFromAnnuity <= 0) return 0;

    if (rate === 0) {
        return requiredFvFromAnnuity / periods;
    }
    
    const fvFactor = (Math.pow(1 + rate, periods) - 1) / rate;
    const annuityFactor = type === 'due' ? fvFactor * (1 + rate) : fvFactor;

    return requiredFvFromAnnuity / annuityFactor;
}

function findRequiredTime(pv: number, pmt: number, targetFv: number, rate: number, type: 'ordinary' | 'due'): number {
    if (calculateTotalFv(pv, pmt, rate, 1, type) >= targetFv) return 1/12;

    let months = 1;
    while(calculateTotalFv(pv, pmt, rate, months, type) < targetFv) {
        if (months > 100 * 12) return Infinity; // Safety break for 100 years
        months++;
    }
    return months / 12;
}

function findRequiredRate(pv: number, pmt: number, targetFv: number, periods: number, type: 'ordinary' | 'due'): number {
    if (pv + pmt * periods >= targetFv) return 0; // No return needed

    let low = 0;
    let high = 1; // Search up to 100% monthly rate, which is an extreme 1200% annual rate.
    let mid = 0;
    
    // Iteratively find the monthly rate. Max 100 iterations.
    for(let i=0; i<100; i++) {
        mid = (low + high) / 2;
        const fv = calculateTotalFv(pv, pmt, mid, periods, type);
        if (Math.abs(fv - targetFv) < 0.01) {
             break;
        } else if (fv < targetFv) {
            low = mid;
        } else {
            high = mid;
        }
    }
    return mid * 12; // Convert monthly nominal rate to annual nominal rate
}


// --- Main Calculation Function ---

export function calculateInvestmentGrowth(
  input: InvestmentInput
): CalculationResult {
  const {
    currentSavings,
    monthlySavings,
    expectedReturnRate,
    inflationRate,
    timeHorizonYears,
    annuityType,
    targetAmount,
  } = input;

  const annualNominalRate = expectedReturnRate / 100;
  const annualInflationRate = inflationRate / 100;

  // --- Using Nominal Monthly Rate (annual rate / 12) ---
  const monthlyNominalRate = annualNominalRate / 12;

  // Scenario Rates
  const conservativeRate = 0.06; // 6%
  const aggressiveRate = 0.20; // 20%
  const monthlyConservativeRate = conservativeRate / 12;
  const monthlyAggressiveRate = aggressiveRate / 12;
  
  const chartData: ChartDataPoint[] = [];

  for (let year = 0; year <= timeHorizonYears; year++) {
    const months = year * 12;

    const nominalValue = calculateTotalFv(currentSavings, monthlySavings, monthlyNominalRate, months, annuityType);
    const realValue = nominalValue / Math.pow(1 + annualInflationRate, year);
    
    // Scenario calculations
    const noInvestment = currentSavings + (monthlySavings * months);
    const conservative = calculateTotalFv(currentSavings, monthlySavings, monthlyConservativeRate, months, annuityType);
    const aggressive = calculateTotalFv(currentSavings, monthlySavings, monthlyAggressiveRate, months, annuityType);

    chartData.push({ 
        year, 
        nominalValue: Math.round(nominalValue), 
        realValue: Math.round(realValue), 
        noInvestment: Math.round(noInvestment), 
        conservative: Math.round(conservative), 
        aggressive: Math.round(aggressive) 
    });
  }

  const finalNominalValue = chartData[chartData.length - 1].nominalValue;
  const isTargetMet = finalNominalValue >= targetAmount;
  const totalInvestment = currentSavings + monthlySavings * timeHorizonYears * 12;
  const totalInterest = finalNominalValue - totalInvestment;

  // --- Generate Recommendations if target is not met ---
  const recommendations: Recommendation[] = [];
  if (!isTargetMet) {
    // 1. Increase Monthly Savings
    const requiredMonthlySavings = findRequiredMonthlySavings(currentSavings, targetAmount, monthlyNominalRate, timeHorizonYears * 12, annuityType);
    if(requiredMonthlySavings > monthlySavings && isFinite(requiredMonthlySavings)) {
        recommendations.push({
            type: 'increaseMonthlySavings',
            value: requiredMonthlySavings,
            text: 'Increase monthly savings to reach your goal.'
        });
    }

    // 2. Extend Time Horizon
    const requiredYears = findRequiredTime(currentSavings, monthlySavings, targetAmount, monthlyNominalRate, annuityType);
    if (requiredYears > timeHorizonYears && isFinite(requiredYears)) {
        recommendations.push({
            type: 'extendTimeHorizon',
            value: requiredYears,
            text: 'Extend your investment time to reach your goal.'
        });
    }

    // 3. Increase Return Rate
    const requiredAnnualRate = findRequiredRate(currentSavings, monthlySavings, targetAmount, timeHorizonYears * 12, annuityType);
     if (requiredAnnualRate > annualNominalRate && isFinite(requiredAnnualRate)) {
        recommendations.push({
            type: 'increaseReturnRate',
            value: requiredAnnualRate * 100,
            text: 'Find an investment with a higher annual return.'
        });
    }
  }

  return {
    chartData,
    finalNominalValue,
    finalRealValue: chartData[chartData.length - 1].realValue,
    totalInvestment,
    totalInterest,
    targetAmount,
    isTargetMet,
    recommendations
  };
}
