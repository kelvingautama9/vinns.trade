import type { 
    ChartDataPoint, 
    InvestmentInput, 
    CalculationResult, 
    Recommendation,
    PositionSizingInput,
    PositionSizingResult
} from '@/types';

// --- Investment Growth Calculation ---

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
    if (rate <= 0 && (pv + pmt) < targetFv) return Infinity; 

    let months = 1;
    while(calculateTotalFv(pv, pmt, rate, months, type) < targetFv) {
        if (months > 100 * 12) return Infinity; 
        months++;
    }
    return months / 12;
}

function findRequiredRate(pv: number, pmt: number, targetFv: number, periods: number, type: 'ordinary' | 'due'): number {
    if (pv + pmt * periods >= targetFv) return 0; 

    let low = 0;
    let high = 1; 
    let mid = 0;
    
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
    return mid * 12;
}

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
  
  const monthlyNominalRate = annualNominalRate / 12;
  const realRateIsNegative = annualNominalRate <= annualInflationRate;

  const conservativeRate = 0.06;
  const aggressiveRate = 0.20; 
  const monthlyConservativeRate = conservativeRate / 12;
  const monthlyAggressiveRate = aggressiveRate / 12;
  
  const chartData: ChartDataPoint[] = [];

  for (let year = 0; year <= timeHorizonYears; year++) {
    const months = year * 12;

    const nominalValue = calculateTotalFv(currentSavings, monthlySavings, monthlyNominalRate, months, annuityType);
    const realValue = nominalValue / Math.pow(1 + annualInflationRate, year);
    
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
  const isTargetMet = targetAmount > 0 && finalNominalValue >= targetAmount;
  const totalInvestment = currentSavings + monthlySavings * timeHorizonYears * 12;
  const totalInterest = finalNominalValue - totalInvestment;

  const recommendations: Recommendation[] = [];
  if (targetAmount > 0 && !isTargetMet) {
    const requiredMonthlySavings = findRequiredMonthlySavings(currentSavings, targetAmount, monthlyNominalRate, timeHorizonYears * 12, annuityType);
    if(requiredMonthlySavings > monthlySavings && isFinite(requiredMonthlySavings)) {
        recommendations.push({
            type: 'increaseMonthlySavings',
            value: requiredMonthlySavings,
        });
    }

    const requiredYears = findRequiredTime(currentSavings, monthlySavings, targetAmount, monthlyNominalRate, annuityType);
    if (requiredYears > timeHorizonYears && isFinite(requiredYears)) {
        recommendations.push({
            type: 'extendTimeHorizon',
            value: requiredYears,
        });
    }

    const requiredAnnualRate = findRequiredRate(currentSavings, monthlySavings, targetAmount, timeHorizonYears * 12, annuityType);
     if (requiredAnnualRate > annualNominalRate && isFinite(requiredAnnualRate)) {
        recommendations.push({
            type: 'increaseReturnRate',
            value: requiredAnnualRate * 100,
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
    recommendations,
    realRateIsNegative,
    expectedReturnRate,
    inflationRate,
  };
}


// --- Position Sizing & Risk Management Calculation ---

export function calculatePositionSizing(
  input: PositionSizingInput
): PositionSizingResult {
  const {
    totalCapital,
    riskPerTrade, // This is a percentage, e.g., 1 for 1%
    entryPrice,
    stopLossPrice,
    takeProfitPrice,
  } = input;

  // 1. RISK PER UNIT
  const riskPerUnit = entryPrice - stopLossPrice;
  if (riskPerUnit <= 0) {
    throw new Error("Stop Loss Price must be lower than Entry Price.");
  }

  // 2. REWARD PER UNIT
  const rewardPerUnit = takeProfitPrice - entryPrice;
  if (rewardPerUnit <= 0) {
     throw new Error("Take Profit Price must be higher than Entry Price.");
  }

  // 3. RISK-REWARD RATIO
  const riskRewardRatio = rewardPerUnit / riskPerUnit;

  // 4. POSITION SIZING
  const totalRiskAmount = totalCapital * (riskPerTrade / 100);
  const positionSize = totalRiskAmount / riskPerUnit;
  const totalProfit = positionSize * rewardPerUnit;

  // 5. RECOVERY FACTOR
  const lossPercentage = riskPerTrade / 100;
  const gainNeeded = (1 / (1 - lossPercentage)) - 1;
  const recoveryFactor = gainNeeded * 100;

  // C. PSYCHOLOGICAL EDGE (Breakeven Win Rate)
  const breakevenWinRate = (1 / (1 + riskRewardRatio)) * 100;

  return {
    totalProfit,
    totalRisk: totalRiskAmount,
    riskRewardRatio,
    positionSize,
    breakevenWinRate,
    recoveryFactor,
  };
}
