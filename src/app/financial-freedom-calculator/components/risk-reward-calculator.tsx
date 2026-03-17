'use client';

import { useState } from 'react';
import type { RiskRewardInput, RiskRewardResult } from '@/types';
import { calculateRiskRewardProbability } from '@/lib/finance';
import { Card } from '@/components/ui/card';
import { RiskRewardForm } from './risk-reward-form';
import { RiskRewardResults } from './risk-reward-results';

export function RiskRewardCalculator() {
  const [result, setResult] = useState<RiskRewardResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCalculate = (data: RiskRewardInput) => {
    setIsLoading(true);
    setResult(null);

    setTimeout(() => {
        try {
            const resultData = calculateRiskRewardProbability(data);
            setResult(resultData);
        } catch (error) {
            console.error(error);
            // Optionally, set an error state to show in the UI
        } finally {
            setIsLoading(false);
        }
    }, 500);
  };

  return (
    <Card className="p-4 md:p-6 lg:p-8 !border-border/20 !bg-card/50 !shadow-2xl !backdrop-blur-xl">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <RiskRewardForm onCalculate={handleCalculate} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-3">
          <RiskRewardResults result={result} isLoading={isLoading} />
        </div>
      </div>
    </Card>
  );
}
