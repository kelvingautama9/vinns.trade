'use client';

import type { RiskRewardResult } from '@/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatRupiah, cn } from '@/lib/utils';
import { CheckCircle2, XCircle, BarChart, BrainCircuit, Building } from 'lucide-react';

type RiskRewardResultsProps = {
  result: RiskRewardResult | null;
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
    riskRewardRatio,
    nominalExpectancy,
    expectancyRatio,
    status,
    message,
    riskAmount,
    avgWin,
  } = result;

  const isPositive = status === 'POSITIVE EDGE / VALIDATED';

  return (
    <div className="space-y-6">
      <Card className={cn(
          "border-2",
          isPositive ? "border-green-500/50 bg-green-500/10" : "border-red-500/50 bg-red-500/10"
      )}>
        <CardHeader>
          <CardTitle className={cn(
              "flex items-center gap-2 text-lg",
              isPositive ? "text-green-400" : "text-red-400"
          )}>
            {isPositive ? <CheckCircle2 /> : <XCircle />}
            {status}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{message}</p>
        </CardContent>
      </Card>
      
      <Card className="!border-border/20 !bg-card/50 !shadow-2xl !backdrop-blur-xl">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <BarChart className="text-primary" />
                Statistical Expectancy
            </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-center">
            <div className="rounded-lg p-4 bg-background/50">
                <p className="text-sm text-muted-foreground">Risk:Reward Ratio</p>
                <p className="text-2xl font-bold">1 : {riskRewardRatio.toFixed(2)}</p>
            </div>
             <div className="rounded-lg p-4 bg-background/50">
                <p className="text-sm text-muted-foreground">Nominal Expectancy</p>
                <p className={cn("text-2xl font-bold", isPositive ? "text-green-400" : "text-red-400")}>
                    {formatRupiah(nominalExpectancy)}
                </p>
            </div>
             <div className="rounded-lg p-4 bg-background/50">
                <p className="text-sm text-muted-foreground">Expectancy Ratio</p>
                <p className={cn("text-2xl font-bold", isPositive ? "text-green-400" : "text-red-400")}>
                    {(expectancyRatio * 100).toFixed(2)}%
                </p>
            </div>
        </CardContent>
      </Card>

       <Accordion type="multiple" className="w-full space-y-4">
        <AccordionItem value="item-1" className="rounded-xl border-none bg-card text-card-foreground shadow-lg !border-border/20 !bg-card/50 !shadow-2xl !backdrop-blur-xl">
          <AccordionTrigger className="px-6 hover:no-underline">
            <div className="flex items-center gap-3 text-base font-semibold">
              <BrainCircuit className="h-5 w-5 text-primary" />
              <span>Expert Analysis</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6">
            <div className="prose prose-sm dark:prose-invert max-w-none space-y-4 text-muted-foreground">
                <div>
                    <h4 className="mb-1 font-semibold text-foreground">The Expectancy Formula: A Breakdown</h4>
                    <p>
                        The core of this analysis is the expectancy formula: <strong>E = [Win % * Avg. Win] - [Loss % * Avg. Loss]</strong>. In your case:
                    </p>
                     <ul className="list-disc space-y-1 pl-5">
                       <li><strong>Average Win (Aw):</strong> {formatRupiah(avgWin)}</li>
                        <li><strong>Average Loss (Al):</strong> {formatRupiah(riskAmount)}</li>
                    </ul>
                    <p>
                        A positive expectancy means that, over a large number of trades, your winning trades will generate more money than your losing trades will lose, leading to net profitability. A negative expectancy indicates a flawed system that is statistically guaranteed to lose money over time.
                    </p>
                </div>
                <div>
                    <h4 className="mb-1 font-semibold text-foreground">Understanding Your "Edge"</h4>
                     <p>
                        "Edge" is a term used to describe a statistical advantage over the market. Your <strong>Nominal Expectancy</strong> of {formatRupiah(nominalExpectancy)} is the monetary value of your edge per trade. The <strong>Expectancy Ratio</strong> of {(expectancyRatio * 100).toFixed(2)}% tells you the same thing, but as a percentage of your amount risked. For every {formatRupiah(1)} you risk, you can statistically expect to make a profit of {formatRupiah(nominalExpectancy / riskAmount)} over the long run.
                    </p>
                </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-2" className="rounded-xl border-none bg-card text-card-foreground shadow-lg !border-border/20 !bg-card/50 !shadow-2xl !backdrop-blur-xl">
          <AccordionTrigger className="px-6 hover:no-underline">
            <div className="flex items-center gap-3 text-base font-semibold">
              <Building className="h-5 w-5 text-primary" />
              <span>Institutional Perspective</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6">
            <div className="prose prose-sm dark:prose-invert max-w-none space-y-4 text-muted-foreground">
                <div>
                    <p>
                        Hedge funds and proprietary trading firms live and die by expectancy. No strategy is deployed with institutional capital unless it demonstrates a persistent positive edge, even if it's small.
                    </p>
                    <p>
                        A key metric is the relationship between Win Rate and Risk:Reward Ratio. A system does not need a high win rate to be profitable. For example:
                    </p>
                     <ul className='list-disc space-y-1 pl-5'>
                        <li><strong>Trend Following Systems:</strong> Often have low win rates (30-40%) but very high R:R ratios (1:5, 1:10, or more). They lose small on many trades but capture massive wins on a few, resulting in a strong positive expectancy.</li>
                        <li><strong>Mean Reversion Systems:</strong> Typically have high win rates (60-80%) but low R:R ratios (often less than 1:1). They make many small, consistent profits, but must carefully manage the few large losses that can erase gains.</li>
                    </ul>
                    <p>
                        Your strategy, with a {result.winRate}% win rate and a 1:{riskRewardRatio.toFixed(2)} R:R, fits into a specific profile. The goal is not just to have a positive expectancy, but to understand its characteristics to manage your psychology and capital allocation effectively.
                    </p>
                </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

    </div>
  );
}

function InitialState() {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card/50 p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
        <BarChart className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-xl font-semibold">Risk-Reward Probability Engine</h3>
      <p className="mt-1 text-muted-foreground">
        Input your trading parameters to analyze the statistical expectancy of your strategy.
      </p>
    </div>
  );
}

function LoadingState() {
  return (
     <div className="space-y-6">
      <Card className="!border-border/20 !bg-card/50 !shadow-2xl !backdrop-blur-xl">
        <CardHeader>
          <Skeleton className="h-8 w-3/5" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
      <Card className="!border-border/20 !bg-card/50 !shadow-2xl !backdrop-blur-xl">
        <CardHeader>
            <Skeleton className="h-8 w-2/5" />
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
