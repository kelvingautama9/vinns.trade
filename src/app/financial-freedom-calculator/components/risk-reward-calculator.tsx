'use client';

import { useState } from 'react';
import type { PositionSizingInput, PositionSizingResult, Currency } from '@/types';
import { calculatePositionSizing } from '@/lib/finance';
import { Card } from '@/components/ui/card';
import { RiskRewardForm } from './risk-reward-form';
import { RiskRewardResults } from './risk-reward-results';
import { useToast } from '@/hooks/use-toast';

export function RiskRewardCalculator() {
  const [result, setResult] = useState<PositionSizingResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currency, setCurrency] = useState<Currency>('IDR');
  const { toast } = useToast();

  const handleCalculate = (data: PositionSizingInput) => {
    setIsLoading(true);
    setResult(null);

    setTimeout(() => {
        try {
            const resultData = calculatePositionSizing(data);
            setResult(resultData);
        } catch (error: any) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Invalid Trade Parameters",
                description: error.message || "Please check your inputs.",
            })
        } finally {
            setIsLoading(false);
        }
    }, 500);
  };

  return (
    <Card className="p-4 md:p-6 lg:p-8 !border-border/20 !bg-card/50 !shadow-2xl !backdrop-blur-xl">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <RiskRewardForm 
            onCalculate={handleCalculate} 
            isLoading={isLoading} 
            currency={currency}
            setCurrency={setCurrency}
          />
        </div>
        <div className="lg:col-span-3">
          <RiskRewardResults result={result} isLoading={isLoading} currency={currency}/>
        </div>
      </div>
    </Card>
  );
}
