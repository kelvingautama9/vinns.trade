'use client';

import type { PositionSizingResult } from '@/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatRupiah, cn } from '@/lib/utils';
import { Scale, ShieldCheck, BrainCircuit, ShieldAlert, BarChart, ArrowUp, ArrowDown, Target } from 'lucide-react';

type RiskRewardResultsProps = {
  result: PositionSizingResult | null;
  isLoading: boolean;
};

export function RiskRewardResults({ result, isLoading }: RiskRewardResultsProps) {
  if (isLoading) {
    return <LoadingState />;
  }

  if (!result) {
    return <InitialState />;
  }

  const {
    totalProfit,
    totalRisk,
    riskRewardRatio,
    positionSize,
    breakevenWinRate,
    recoveryFactor,
  } = result;

  const isHealthy = riskRewardRatio >= 2;
  const isIllogical = riskRewardRatio < 1;

  const formatPositionSize = (size: number) => {
    if (size < 1000) return size.toFixed(2);
    return new Intl.NumberFormat('id-ID').format(size);
  }

  return (
    <div className="space-y-6">
      {isIllogical && (
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>High Risk / Illogical</AlertTitle>
          <AlertDescription>
            Potential loss is greater than potential profit. This trade is generally not recommended.
          </AlertDescription>
        </Alert>
      )}
      {isHealthy && !isIllogical && (
        <Alert className="border-green-500/50 bg-green-900/20 text-green-400">
           <ShieldCheck className="h-4 w-4" />
          <AlertTitle>Healthy Trade Structure</AlertTitle>
          <AlertDescription>
            Your risk structure is professional-grade. The potential reward justifies the risk taken.
          </AlertDescription>
        </Alert>
      )}
      
      <Card className="!border-border/20 !bg-card/50 !shadow-2xl !backdrop-blur-xl">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Target className="text-primary" />
                <span>Scenario Summary</span>
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                <div className="rounded-lg p-4 bg-background/50">
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-2"><ArrowUp className="text-green-500"/> If Correct (Profit)</p>
                    <p className="text-2xl font-bold text-green-400">{formatRupiah(totalProfit)}</p>
                </div>
                <div className="rounded-lg p-4 bg-background/50">
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-2"><ArrowDown className="text-red-500"/> If Wrong (Loss)</p>
                    <p className="text-2xl font-bold text-red-400">{formatRupiah(totalRisk)}</p>
                </div>
            </div>
             <div className="rounded-lg p-4 bg-background/50 text-center">
                <p className="text-sm text-muted-foreground">Reward/Risk Ratio</p>
                <p className={cn("text-2xl font-bold", isIllogical ? "text-red-400" : "text-green-400")}>1 : {riskRewardRatio.toFixed(2)}</p>
            </div>
        </CardContent>
      </Card>

      <Card className="!border-border/20 !bg-card/50 !shadow-2xl !backdrop-blur-xl">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Scale className="text-primary" />
                <span>Execution Instructions</span>
            </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Allowed Units/Lots to Buy</p>
            <p className="text-4xl font-extrabold text-primary">{formatPositionSize(positionSize)}</p>
            <p className="text-xs text-muted-foreground pt-2">Do not buy more than this amount to keep your account safe based on your <strong>{result.totalRisk / result.totalCapital * 100}%</strong> risk rule.</p>
        </CardContent>
      </Card>

      <Card className="!border-border/20 !bg-card/50 !shadow-2xl !backdrop-blur-xl">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <BrainCircuit className="text-primary" />
                <span>Psychological Edge</span>
            </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
            <div className="rounded-lg p-4 bg-background/50">
                <p className="text-sm text-muted-foreground">Breakeven Win Rate</p>
                <p className="text-2xl font-bold">{breakevenWinRate.toFixed(2)}%</p>
                <p className="text-xs text-muted-foreground mt-1">You only need to be right this often to not lose money.</p>
            </div>
             <div className="rounded-lg p-4 bg-background/50">
                <p className="text-sm text-muted-foreground">Recovery Factor</p>
                <p className="text-2xl font-bold">{recoveryFactor.toFixed(2)}%</p>
                <p className="text-xs text-muted-foreground mt-1">Gain needed on the next trade to recover from one loss.</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InitialState() {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card/50 p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
        <BarChart className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-xl font-semibold">Position Sizing Calculator</h3>
      <p className="mt-1 text-muted-foreground">
        Enter your trade parameters to determine a safe position size.
      </p>
    </div>
  );
}

function LoadingState() {
  return (
     <div className="space-y-6">
      <Card className="!border-border/20 !bg-card/50 !shadow-2xl !backdrop-blur-xl">
        <CardHeader>
            <Skeleton className="h-8 w-2/5" />
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
      <Card className="!border-border/20 !bg-card/50 !shadow-2xl !backdrop-blur-xl">
        <CardHeader>
          <Skeleton className="h-8 w-3/5" />
        </CardHeader>
        <CardContent className="text-center space-y-2">
            <Skeleton className="h-6 w-1/2 mx-auto" />
            <Skeleton className="h-12 w-1/3 mx-auto" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
        </CardContent>
      </Card>
      <Card className="!border-border/20 !bg-card/50 !shadow-2xl !backdrop-blur-xl">
        <CardHeader>
            <Skeleton className="h-8 w-2/5" />
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
