'use client';

import { useState } from 'react';
import { InvestmentForm } from './investment-form';
import { ResultsDisplay } from './results-display';
import type { CalculationResult, InvestmentInput } from '@/types';
import { calculateInvestmentGrowth } from '@/lib/finance';
import { Card } from '@/components/ui/card';

export function InvestmentCalculator() {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCalculate = (data: InvestmentInput) => {
    setIsLoading(true);
    setResult(null);

    // Using setTimeout to ensure loading state is visible for a short duration
    setTimeout(() => {
        const chartData = calculateInvestmentGrowth(data);
        setResult({
            chartData,
        });
        setIsLoading(false);
    }, 500);
  };

  return (
    <Card className="p-4 md:p-6 lg:p-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <InvestmentForm onCalculate={handleCalculate} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-3">
          <ResultsDisplay result={result} isLoading={isLoading} />
        </div>
      </div>
    </Card>
  );
}
