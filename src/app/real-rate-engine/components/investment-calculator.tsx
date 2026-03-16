'use client';

import { useState } from 'react';
import { InvestmentForm } from './investment-form';
import { ResultsDisplay } from './results-display';
import type { CalculationResult, InvestmentInput } from '@/types';
import { calculateInvestmentGrowth } from '@/lib/finance';
import { getInvestmentInsight } from '../actions';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';

export function InvestmentCalculator() {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCalculate = async (data: InvestmentInput) => {
    setIsLoading(true);
    setResult(null);

    // Perform calculations
    const chartData = calculateInvestmentGrowth(data);
    
    // Fetch AI insight
    const insightPromise = getInvestmentInsight(data);

    const [insightResult] = await Promise.all([insightPromise]);

    if (insightResult.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: insightResult.error,
      });
    }

    setResult({
      chartData,
      aiInsight: insightResult.data ?? "Could not generate insight.",
    });

    setIsLoading(false);
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
