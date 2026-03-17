'use client';

import { useState } from 'react';
import type { CalculationResult, Recommendation } from '@/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency, cn } from '@/lib/utils';
import { Frown, Info, Sparkles, Star, Target, TrendingUp, Zap, HelpCircle, ShieldCheck, Rabbit, Turtle } from 'lucide-react';
import { GrowthChart } from './growth-chart';
import { Skeleton } from '@/components/ui/skeleton';


type ResultsDisplayProps = {
  result: CalculationResult | null;
  isLoading: boolean;
};

const initialVisibleLines = {
  nominalValue: true,
  realValue: true,
  noInvestment: false,
  conservative: false,
  aggressive: false,
};

const lineNames: Record<string, string> = {
    nominalValue: 'Your Projection (Nominal)',
    realValue: 'Your Projection (Real)',
    noInvestment: 'No Investment',
    conservative: 'Conservative Strategy (6%)',
    aggressive: 'Aggressive Strategy (20%)',
}

export function ResultsDisplay({ result, isLoading }: ResultsDisplayProps) {
  const [visibleLines, setVisibleLines] = useState(initialVisibleLines);

  const handleLineVisibilityChange = (key: keyof typeof initialVisibleLines) => {
    setVisibleLines(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!result || !result.chartData || result.chartData.length === 0 || result.targetAmount === 0) {
    return <InitialState />;
  }

  const {
    chartData,
    finalNominalValue,
    totalInvestment,
    totalInterest,
    targetAmount,
    isTargetMet,
    recommendations,
    realRateIsNegative,
    expectedReturnRate,
    inflationRate,
  } = result;

  const shortfall = targetAmount - finalNominalValue;
  const principalPercentage = (totalInvestment / finalNominalValue) * 100;
  const interestPercentage = 100 - principalPercentage;
  const lastYearData = chartData[chartData.length - 1];

  return (
    <div className="space-y-6">
      {!isTargetMet && (
        <Alert variant="destructive" className="border-destructive/50 bg-destructive/20 text-destructive-foreground backdrop-blur-lg">
          <Frown className="h-4 w-4" />
          <AlertTitle>Strategy Needs Adjustment</AlertTitle>
          <AlertDescription>
            Your current strategy may not be enough to reach your financial goal. Consider the recommendations below.
          </AlertDescription>
        </Alert>
      )}

      {isTargetMet && (
         <Alert className="border-success/50 bg-success/20 text-success-foreground backdrop-blur-lg">
          <Sparkles className="h-4 w-4" />
          <AlertTitle>Congratulations!</AlertTitle>
          <AlertDescription>
            Your current strategy is on track to meet your financial goal.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              <span>Goal Overview</span>
            </div>
            <span className="text-sm font-medium text-muted-foreground">
                In {lastYearData.year} Years
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 text-center md:grid-cols-2">
                 <div className="rounded-lg bg-card/50 p-4">
                    <p className="text-sm text-muted-foreground">Your Goal</p>
                    <p className="text-2xl font-bold">{formatCurrency(targetAmount, 'IDR')}</p>
                </div>
                 <div className="rounded-lg bg-card/50 p-4">
                    <p className="text-sm text-muted-foreground">Projected Value</p>
                    <p className={cn(
                        "text-2xl font-bold",
                        isTargetMet ? "text-success" : "text-destructive"
                    )}>{formatCurrency(finalNominalValue, 'IDR')}</p>
                </div>
            </div>
            {!isTargetMet && shortfall > 0 && (
                <div className="text-center font-medium text-destructive">
                    You are short by {formatCurrency(shortfall, 'IDR')}
                </div>
            )}
            <div className="space-y-2 pt-2">
                <div className="flex justify-between text-sm font-medium text-muted-foreground">
                    <span>Principal: {formatCurrency(totalInvestment, 'IDR')} ({principalPercentage.toFixed(0)}%)</span>
                    <span>Interest: {formatCurrency(totalInterest, 'IDR')} ({interestPercentage.toFixed(0)}%)</span>
                </div>
                <Progress value={principalPercentage} className="h-2" />
            </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span>Investment Growth Projection</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <GrowthChart data={chartData} visibleLines={visibleLines} />
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3 lg:grid-cols-5">
            {Object.keys(visibleLines).map(key => (
              <div key={key} className="flex items-center gap-2">
                <Checkbox
                  id={key}
                  checked={visibleLines[key as keyof typeof initialVisibleLines]}
                  onCheckedChange={() => handleLineVisibilityChange(key as keyof typeof initialVisibleLines)}
                />
                <Label htmlFor={key} className="cursor-pointer text-muted-foreground">
                  {lineNames[key as keyof typeof lineNames].split('(')[0]}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {!isTargetMet && recommendations && recommendations.length > 0 && (
        <Card>
             <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Zap className="h-6 w-6 text-accent" />
                    <span>Smart Recommendations</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                 <Tabs defaultValue={recommendations[0].type} className="w-full">
                    <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
                        {recommendations.map(rec => (
                            <TabsTrigger key={rec.type} value={rec.type}>
                               {rec.type === 'increaseMonthlySavings' && 'More Savings'}
                               {rec.type === 'extendTimeHorizon' && 'More Time'}
                               {rec.type === 'increaseReturnRate' && 'Higher Return'}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {recommendations.map(rec => (
                        <TabsContent key={rec.type} value={rec.type} className="prose prose-sm dark:prose-invert mt-4 max-w-none p-2 text-center">
                            {rec.type === 'increaseMonthlySavings' && (
                                <p>To reach your goal with your current timeline and return rate, you could increase your monthly savings to <strong className="text-primary">{formatCurrency(rec.value, 'IDR')}</strong>. This adjustment targets your goal of {formatCurrency(targetAmount, 'IDR')}.</p>
                            )}
                             {rec.type === 'extendTimeHorizon' && (
                                realRateIsNegative ? (
                                    <div>
                                        <p className="font-medium text-destructive">
                                            Your return rate ({expectedReturnRate}%) is below inflation ({inflationRate}%). Extending time will only <strong className='text-destructive'>decrease</strong> your money's real value.
                                        </p>
                                        <p className="mt-2 text-muted-foreground">
                                            <strong>Analogi:</strong> Bayangkan Anda punya sebungkus permen. Setiap tahun, teman Anda mengambil satu permen (inflasi), tapi Anda hanya mendapat setengah permen baru (return). Semakin lama, permen Anda akan semakin sedikit. Anda harus mencari cara agar permen yang Anda dapat lebih banyak dari yang diambil.
                                        </p>
                                    </div>
                                ) : (
                                    <p>To reach your goal with your current savings, you could extend your investment horizon to <strong className="text-primary">{rec.value.toFixed(1)} years</strong>. This gives your investment more time to grow and compound.</p>
                                )
                            )}
                             {rec.type === 'increaseReturnRate' && (
                                <p>To reach your goal with your current savings and timeline, you would need to find an investment with an average annual return of <strong className="text-primary">{rec.value.toFixed(2)}%</strong>. See the "Aggressive" scenario analysis below for ideas.</p>
                            )}
                        </TabsContent>
                    ))}
                </Tabs>
            </CardContent>
        </Card>
      )}

      <Accordion type="multiple" className="w-full space-y-4">
        <AccordionItem value="item-1" className="rounded-xl border-none bg-card text-card-foreground shadow-lg">
          <AccordionTrigger className="px-6 hover:no-underline">
            <div className="flex items-center gap-3 text-base font-semibold">
              <Info className="h-5 w-5 text-primary" />
              <span>Understanding Your Projection</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6">
            <div className="prose prose-sm dark:prose-invert max-w-none space-y-4 text-muted-foreground">
                <div>
                    <h4 className="mb-1 font-semibold text-foreground">Nominal Value (Nominal)</h4>
                    <p>
                        <strong>What it is:</strong> This is the actual amount of money that will be in your investment account in the future. If the calculator projects you will have Rp 1 Billion in 10 years, this is the number you will see in your account statement.
                        <br />
                        <strong>Its Limitation:</strong> This number doesn't account for the fact that the prices of goods and services will rise over time (due to inflation). So, while the number is big, its purchasing power might not be as great as you think.
                    </p>
                </div>
                <div>
                    <h4 className="mb-1 font-semibold text-foreground">Real Value (Real)</h4>
                     <p>
                        <strong>What it is:</strong> This is the true **purchasing power** of your money in the future, measured in today's money. This line answers the question: "If I have Rp 1 Billion in 10 years, what is its value compared to today's money?"
                         <br />
                        <strong>Why it Matters:</strong> This is the most honest measure of your wealth. This line shows whether your investment is truly growing faster than the rise in prices. If the Real Value line is trending up, it means your wealth is effectively increasing.
                    </p>
                </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-2" className="rounded-xl border-none bg-card text-card-foreground shadow-lg">
          <AccordionTrigger className="px-6 hover:no-underline">
            <div className="flex items-center gap-3 text-base font-semibold">
              <HelpCircle className="h-5 w-5 text-primary" />
              <span>Alternative Scenario Analysis</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6">
            <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-muted-foreground">
                <div>
                    <h4 className="mb-2 flex items-center gap-2 font-semibold text-foreground"><ShieldCheck className="text-muted-foreground" />No Investment Scenario</h4>
                    <p>
                        <strong>Analysis:</strong> This line is your most important benchmark; it shows the opportunity cost of not investing. You can clearly see how inflation erodes the purchasing power of your savings over time, even as you continue to save. This is the "worst-case" scenario for long-term wealth growth.
                    </p>
                </div>
                 <div>
                    <h4 className="mb-2 flex items-center gap-2 font-semibold text-foreground"><Turtle className="text-chart-4" />Conservative Scenario (6% Return)</h4>
                    <p>
                        <strong>Risk Profile:</strong> Very Low. The main focus is to protect capital from inflation while achieving modest growth. Suitable for investors who are risk-averse or for short-term financial goals (1-3 years).
                    </p>
                    <p><strong>Asset Examples:</strong></p>
                    <ul className='list-disc space-y-1 pl-5'>
                        <li><strong>Government Bonds (SBN/FR):</strong> Considered the safest asset because they are guaranteed by the state. The best time to enter is when the benchmark interest rate is high, as this locks in a higher yield for future years.</li>
                        <li><strong>Digital Bank Deposits (BPR):</strong> Offer higher interest than conventional banks and are guaranteed by the Deposit Insurance Corporation (LPS) up to a certain limit. Suitable for storing emergency funds or short-term funds.</li>
                        <li><strong>Money Market Mutual Funds:</strong> A highly liquid portfolio containing money market instruments with maturities of less than 1 year. They have almost no risk of principal loss.</li>
                    </ul>
                </div>
                 <div>
                    <h4 className="mb-2 flex items-center gap-2 font-semibold text-foreground"><Rabbit className="text-chart-5" />Aggressive Scenario (20% Return)</h4>
                    <p>
                         <strong>Risk Profile:</strong> High. This scenario aims for maximum capital growth and is willing to accept significant price volatility in the short term. Suitable for investors with a long time horizon (5+ years).
                    </p>
                     <p><strong>Asset Examples (with diversification):</strong></p>
                    <ul className='list-disc space-y-1 pl-5'>
                        <li><strong>US Stock Indices (ETFs: VOO/IVV, QQQ):</strong> Instead of picking a single stock, you buy a "basket" of stocks from the 500 or 100 largest companies in the US. The best time to accumulate is periodically (Dollar Cost Averaging/DCA) every month, especially when the market is correcting (down). This is a core strategy used by many successful investors like Warren Buffett.</li>
                        <li><strong>Digital Assets (Bitcoin, Ethereum):</strong> Have the highest potential return with the highest risk. Allocate a small portion of the portfolio (1-5%). The best time to buy is when the market is "fearful" or after a major decline (bear market), not when everyone is talking about it (bull market peak).</li>
                        <li><strong>Technology Stock Mutual Funds/Index Funds:</strong> Invest in the sector that drives innovation. Like stock indices, DCA is the most prudent strategy. This sector tends to lead when the economy is expanding.</li>
                    </ul>
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
    <div className="flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
        <Star className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-xl font-semibold">Your Financial Future Awaits</h3>
      <p className="mt-1 text-muted-foreground">
        Fill out the form to project your investment growth and get smart recommendations.
      </p>
    </div>
  );
}

function LoadingState() {
  return (
     <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/5" />
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
            </div>
             <Skeleton className="h-4 w-1/2" />
             <Skeleton className="h-2 w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-4/5" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
