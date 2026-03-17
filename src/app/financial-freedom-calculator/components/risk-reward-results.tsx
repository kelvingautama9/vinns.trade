'use client';

import type { PositionSizingResult, Currency } from '@/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, cn } from '@/lib/utils';
import { Scale, ShieldCheck, TrendingUp, ShieldAlert, BarChart, ArrowUp, ArrowDown, Target, Calculator, PieChart, ShieldX, AlertTriangle, Wallet } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type RiskRewardResultsProps = {
  result: PositionSizingResult | null;
  isLoading: boolean;
  currency: Currency;
};

export function RiskRewardResults({ result, isLoading, currency }: RiskRewardResultsProps) {
  if (isLoading) {
    return <LoadingState />;
  }

  if (!result) {
    return <InitialState />;
  }

  const {
    potentialProfit,
    potentialLoss,
    rrRatio,
    positionSize,
    totalPositionValue,
    breakevenWinRate,
    series30wr,
    series40wr,
    series50wr,
    drawdownSeries,
    accountBalance
  } = result;

  const isHealthy = rrRatio >= 2;
  const isBadTrade = rrRatio < 1;

  const formatPositionSize = (size: number) => {
    if (size < 1000) return size.toFixed(2);
    return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(size);
  }

  const riskPercent = accountBalance > 0 ? (potentialLoss / accountBalance) * 100 : 0;
  const profitPercent = accountBalance > 0 ? (potentialProfit / accountBalance) * 100 : 0;

  return (
    <div className="space-y-6">
      {isBadTrade && (
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>BAD TRADE - NEGATIVE EDGE</AlertTitle>
          <AlertDescription>
            Warning: Risk exceeds Reward. This setup is mathematically unsustainable.
          </AlertDescription>
        </Alert>
      )}
      {isHealthy && !isBadTrade && (
        <Alert className="border-green-500/50 text-green-400">
           <ShieldCheck className="h-4 w-4" />
          <AlertTitle>PROBABLE TRADE - HEALTHY EDGE</AlertTitle>
          <AlertDescription>
            High-quality setup. The reward justifies the risk.
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
                    <p className="text-2xl font-bold text-green-400">{formatCurrency(potentialProfit, currency)}</p>
                    <p className="text-xs text-muted-foreground">(+{profitPercent.toFixed(2)}% of Balance)</p>
                </div>
                <div className="rounded-lg p-4 bg-background/50">
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-2"><ArrowDown className="text-red-500"/> If Wrong (Loss)</p>
                    <p className="text-2xl font-bold text-red-400">{formatCurrency(potentialLoss, currency)}</p>
                    <p className="text-xs text-muted-foreground">(-{riskPercent.toFixed(2)}% of Balance)</p>
                </div>
            </div>
             <div className="rounded-lg p-4 bg-background/50 text-center">
                <p className="text-sm text-muted-foreground">Reward/Risk Ratio</p>
                <p className={cn("text-2xl font-bold", isBadTrade ? "text-red-400" : isHealthy ? "text-green-400" : "text-foreground")}>1 : {rrRatio.toFixed(2)}</p>
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
        <CardContent className="space-y-4 text-center">
            <div>
                <p className="text-sm text-muted-foreground">Position Size (Units/Lots)</p>
                <p className="text-4xl font-extrabold text-primary">{formatPositionSize(positionSize)}</p>
            </div>
            <div>
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-2"><Wallet /> Total Position Value</p>
                <p className="text-xl font-bold">{formatCurrency(totalPositionValue, currency)}</p>
            </div>
            <p className="text-xs text-muted-foreground pt-2">This is your calculated position based on the value you entered. The resulting risk for this trade is <strong>{formatCurrency(potentialLoss, currency)}</strong>.</p>
        </CardContent>
      </Card>

      <Card className="!border-border/20 !bg-card/50 !shadow-2xl !backdrop-blur-xl">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Calculator className="text-primary" />
                <span>"The Series of 10 Trades" Simulation</span>
            </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Scenario</TableHead>
                <TableHead>Total Gains</TableHead>
                <TableHead>Total Losses</TableHead>
                <TableHead className="text-right">Net Outcome</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>30% Win Rate<br /><span className="text-xs text-muted-foreground">({series30wr.wins} Wins, {series30wr.losses} Losses)</span></TableCell>
                <TableCell className="font-medium text-green-400">{formatCurrency(series30wr.totalProfit, currency)}</TableCell>
                <TableCell className="font-medium text-red-400">{formatCurrency(series30wr.totalLoss, currency)}</TableCell>
                <TableCell className={cn("text-right font-semibold", series30wr.netOutcome > 0 ? "text-green-400" : "text-red-400")}>{formatCurrency(series30wr.netOutcome, currency)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>40% Win Rate<br /><span className="text-xs text-muted-foreground">({series40wr.wins} Wins, {series40wr.losses} Losses)</span></TableCell>
                <TableCell className="font-medium text-green-400">{formatCurrency(series40wr.totalProfit, currency)}</TableCell>
                <TableCell className="font-medium text-red-400">{formatCurrency(series40wr.totalLoss, currency)}</TableCell>
                <TableCell className={cn("text-right font-semibold", series40wr.netOutcome > 0 ? "text-green-400" : "text-red-400")}>{formatCurrency(series40wr.netOutcome, currency)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>50% Win Rate<br /><span className="text-xs text-muted-foreground">({series50wr.wins} Wins, {series50wr.losses} Losses)</span></TableCell>
                <TableCell className="font-medium text-green-400">{formatCurrency(series50wr.totalProfit, currency)}</TableCell>
                <TableCell className="font-medium text-red-400">{formatCurrency(series50wr.totalLoss, currency)}</TableCell>
                <TableCell className={cn("text-right font-semibold", series50wr.netOutcome > 0 ? "text-green-400" : "text-red-400")}>{formatCurrency(series50wr.netOutcome, currency)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="text-xs text-muted-foreground pt-3 space-y-2">
            <p>
                Simulation assumes each of the 10 trades has the same parameters, resulting in a consistent risk of <strong>{formatCurrency(potentialLoss, currency)}</strong> per trade.
            </p>
            <p>
                With this R:R, you only need a <strong>{breakevenWinRate.toFixed(2)}%</strong> win rate to break even.
                <br/>
                <strong>Expert Advice:</strong> If your historical win rate is low, focus on finding trades with a higher Risk:Reward ratio instead of trying to win more often.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="!border-border/20 !bg-card/50 !shadow-2xl !backdrop-blur-xl">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <ShieldX className="text-primary" />
                <span>Drawdown Simulation</span>
            </CardTitle>
        </CardHeader>
        <CardContent>
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Consecutive Losses</TableHead>
                <TableHead>Total Loss</TableHead>
                <TableHead className="text-right">Remaining Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drawdownSeries.map(drawdown => (
                <TableRow key={drawdown.trades}>
                  <TableCell>{drawdown.trades} Trades</TableCell>
                  <TableCell className="text-red-400">{formatCurrency(drawdown.lossAmount, currency)}</TableCell>
                  <TableCell className={cn("text-right font-semibold", drawdown.remainingCapital < accountBalance * 0.5 ? "text-red-400" : "text-foreground" )}>
                    {drawdown.remainingCapital > 0 ? formatCurrency(drawdown.remainingCapital, currency) : `-${formatCurrency(Math.abs(drawdown.remainingCapital), currency)}`}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           <p className="text-xs text-muted-foreground pt-3">
              This simulation shows the impact of consecutive losses on your account balance, assuming a consistent risk of <strong>{formatCurrency(potentialLoss, currency)}</strong> per trade. It highlights the importance of position sizing to survive losing streaks.
           </p>
        </CardContent>
      </Card>
       <Alert variant="default" className="text-xs text-muted-foreground">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Disclaimer</AlertTitle>
          <AlertDescription>
            Trading involves significant risk. This tool provides mathematical projections, not financial advice. Past performance is not indicative of future results.
          </AlertDescription>
        </Alert>
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
        Enter your trade parameters to determine a safe position size based on your risk tolerance.
      </p>
    </div>
  );
}

function LoadingState() {
  return (
     <div className="space-y-6">
      <Card>
        <CardHeader>
            <Skeleton className="h-8 w-2/5" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
          </div>
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/5" />
        </CardHeader>
        <CardContent className="space-y-2">
            <Skeleton className="h-10 w-1/3 mx-auto" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
            <Skeleton className="h-8 w-2/5" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
