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
import { formatRupiah } from '@/lib/utils';
import { Frown, Info, Sparkles, Star, Target, TrendingUp, Zap } from 'lucide-react';
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

export function ResultsDisplay({ result, isLoading }: ResultsDisplayProps) {
  const [visibleLines, setVisibleLines] = useState(initialVisibleLines);

  const handleLineVisibilityChange = (key: string) => {
    setVisibleLines(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!result || !result.chartData || result.chartData.length === 0) {
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
    inflationRate,
  } = result;

  const shortfall = targetAmount - finalNominalValue;
  const principalPercentage = (totalInvestment / finalNominalValue) * 100;
  const lastYearData = chartData[chartData.length - 1];

  return (
    <div className="space-y-6">
      {!isTargetMet && (
        <Alert variant="destructive" className="bg-red-50 dark:bg-red-950/30">
          <Frown className="h-4 w-4" />
          <AlertTitle>Strategy Needs Adjustment</AlertTitle>
          <AlertDescription>
            Your current strategy may not be enough to reach your financial goal. Consider the recommendations below.
          </AlertDescription>
        </Alert>
      )}

      {isTargetMet && (
         <Alert className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
          <Sparkles className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800 dark:text-green-300">Congratulations!</AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-400">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                 <div className="rounded-lg p-4 bg-secondary/50">
                    <p className="text-sm text-muted-foreground">Your Goal</p>
                    <p className="text-2xl font-bold">{formatRupiah(targetAmount)}</p>
                </div>
                 <div className="rounded-lg p-4 bg-secondary/50">
                    <p className="text-sm text-muted-foreground">Projected Value</p>
                    <p className="text-2xl font-bold">{formatRupiah(finalNominalValue)}</p>
                </div>
            </div>
            {!isTargetMet && shortfall > 0 && (
                <div className="text-center text-red-600 dark:text-red-400 font-medium">
                    You are short by {formatRupiah(shortfall)}
                </div>
            )}
            <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium text-muted-foreground">
                    <span>Principal: {formatRupiah(totalInvestment)}</span>
                    <span>Interest: {formatRupiah(totalInterest)}</span>
                </div>
                <Progress value={principalPercentage} />
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
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-sm">
            {Object.keys(visibleLines).map(key => (
              <div key={key} className="flex items-center gap-2">
                <Checkbox
                  id={key}
                  checked={visibleLines[key as keyof typeof visibleLines]}
                  onCheckedChange={() => handleLineVisibilityChange(key)}
                />
                <Label htmlFor={key} className="text-muted-foreground cursor-pointer">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Accordion type="single" collapsible className="w-full rounded-lg border bg-card px-6 text-card-foreground shadow-sm">
        <AccordionItem value="item-1" className="border-b-0">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2 text-base font-semibold">
              <Info className="h-5 w-5 text-primary" />
              <span>Memahami Proyeksi dan Skenario</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="prose prose-sm dark:prose-invert max-w-none space-y-4 text-muted-foreground">
                <div>
                    <h4 className="mb-1 font-semibold text-foreground">Nilai Nominal (Garis "Your Projection (Nominal)")</h4>
                    <p>
                        <strong>Apa itu:</strong> Ini adalah jumlah uang <strong>aktual</strong> yang akan ada di akun investasi Anda di masa depan. Jika kalkulator memproyeksikan Anda akan memiliki Rp 1 Miliar dalam 10 tahun, inilah angka yang akan Anda lihat di rekening Anda.
                    </p>
                    <p>
                        <strong>Keterbatasan:</strong> Angka ini tidak memperhitungkan bahwa harga barang dan jasa akan naik seiring waktu (karena inflasi). Jadi, meskipun angkanya besar, daya belinya mungkin tidak sebesar yang Anda kira.
                    </p>
                </div>
                <div>
                    <h4 className="mb-1 font-semibold text-foreground">Nilai Riil (Garis "Your Projection (Real)")</h4>
                     <p>
                        <strong>Apa itu:</strong> Ini adalah <strong>daya beli sesungguhnya</strong> dari uang Anda di masa depan, yang diukur dengan nilai uang hari ini. Garis ini menjawab pertanyaan: "Jika saya memiliki Rp 1 Miliar dalam 10 tahun, berapa nilainya jika dibandingkan dengan uang hari ini?"
                    </p>
                    <p>
                        <strong>Mengapa ini Penting:</strong> Inilah ukuran kekayaan Anda yang paling jujur. Garis ini menunjukkan apakah investasi Anda benar-benar tumbuh lebih cepat daripada kenaikan harga-harga. Jika garis Nilai Riil menanjak, berarti kekayaan Anda secara efektif bertambah.
                    </p>
                </div>
                <div>
                    <h4 className="mb-1 font-semibold text-foreground">Skenario Tanpa Investasi (Garis "No Investment")</h4>
                    <p>
                        <strong>Apa itu:</strong> Garis ini menunjukkan total uang yang akan Anda miliki jika Anda hanya menabung di rekening biasa (misalnya di bawah kasur atau rekening bank tanpa bunga) tanpa diinvestasikan sama sekali.
                    </p>
                    <p>
                         <strong>Mengapa ini Penting:</strong> Ini adalah titik acuan Anda. Garis ini dengan jelas menunjukkan biaya peluang (opportunity cost) jika Anda tidak berinvestasi. Selisih antara garis ini dan garis proyeksi Anda adalah keuntungan dari kekuatan compounding.
                    </p>
                </div>
                 <div>
                    <h4 className="mb-1 font-semibold text-foreground">Skenario Konservatif (Garis "Conservative")</h4>
                    <p>
                        <strong>Apa itu:</strong> Skenario ini memproyeksikan hasil dengan return tahunan yang lebih rendah dan stabil (6%), yang mencerminkan pendekatan investasi berisiko rendah.
                    </p>
                    <p><strong>Contoh Aset:</strong></p>
                    <ul>
                        <li><strong>Obligasi Pemerintah (SBN):</strong> Surat utang negara yang dianggap sangat aman.</li>
                        <li><strong>Deposito Bank:</strong> Simpanan berjangka dengan bunga tetap.</li>
                        <li><strong>Emas:</strong> Aset safe-haven yang cenderung stabil.</li>
                        <li><strong>Reksadana Pasar Uang:</strong> Portofolio berisi instrumen pasar uang jangka pendek.</li>
                    </ul>
                </div>
                 <div>
                    <h4 className="mb-1 font-semibold text-foreground">Skenario Agresif (Garis "Aggressive")</h4>
                    <p>
                        <strong>Apa itu:</strong> Skenario ini menggunakan asumsi return tahunan yang lebih tinggi (20%) untuk menunjukkan potensi pertumbuhan dari investasi berisiko lebih tinggi.
                    </p>
                     <p><strong>Contoh Aset (dengan diversifikasi):</strong></p>
                    <ul>
                        <li><strong>Indeks Saham (ETF):</strong> Seperti S&P 500 (VOO) atau NASDAQ 100 (QQQ) yang berisi saham perusahaan top AS.</li>
                        <li><strong>Aset Digital:</strong> Seperti Bitcoin (BTC) atau Ethereum (ETH), yang memiliki volatilitas tinggi.</li>
                        <li><strong>Reksadana Saham:</strong> Portofolio yang dikelola secara aktif yang berinvestasi di pasar saham.</li>
                    </ul>
                </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {!isTargetMet && recommendations && recommendations.length > 0 && (
        <Card>
             <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Zap className="h-6 w-6 text-primary" />
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
                        <TabsContent key={rec.type} value={rec.type} className="mt-4 text-center">
                            {rec.type === 'increaseMonthlySavings' && (
                                <p>To reach your goal, you could increase your monthly savings to <strong className="text-primary">{formatRupiah(rec.value)}</strong>.</p>
                            )}
                             {rec.type === 'extendTimeHorizon' && (
                                realRateIsNegative ? (
                                    <p className="font-medium text-destructive">
                                        Your return rate is below inflation ({inflationRate}%). More time will only decrease your money's real value. Aim for a return rate that beats inflation.
                                    </p>
                                ) : (
                                    <p>To reach your goal, you could extend your investment horizon to <strong className="text-primary">{rec.value.toFixed(1)} years</strong>.</p>
                                )
                            )}
                             {rec.type === 'increaseReturnRate' && (
                                <p>To reach your goal, you would need to find an investment with an average annual return of <strong className="text-primary">{rec.value.toFixed(2)}%</strong>.</p>
                            )}
                        </TabsContent>
                    ))}
                </Tabs>
            </CardContent>
        </Card>
      )}
    </div>
  );
}

function InitialState() {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card p-8 text-center">
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
             <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-4/5" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
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
