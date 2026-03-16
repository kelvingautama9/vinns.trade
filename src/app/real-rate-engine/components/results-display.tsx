'use client';

import type { CalculationResult } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GrowthChart } from './growth-chart';
import { TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type ResultsDisplayProps = {
  result: CalculationResult | null;
  isLoading: boolean;
};

export function ResultsDisplay({ result, isLoading }: ResultsDisplayProps) {
  if (isLoading) {
    return <LoadingState />;
  }

  if (!result) {
    return <InitialState />;
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span>Investment Growth Projection</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <GrowthChart data={result.chartData} />
        </CardContent>
      </Card>
    </div>
  );
}

function InitialState() {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
        <TrendingUp className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-xl font-semibold">Your Results Await</h3>
      <p className="mt-1 text-muted-foreground">
        Fill out the form to see your investment projection.
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-3/5" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
