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
    riskAmount,
    avgWin,
  } = result;

  const isPositive = status === 'POSITIVE EDGE / VALIDATED';
  const statusTitle = isPositive ? "Strategi Tervalidasi" : "Peringatan: Strategi Berisiko Tinggi";
  const statusMessage = isPositive
    ? "Secara statistik, akun Anda diproyeksikan akan tumbuh jika Anda disiplin mengikuti rencana ini."
    : "Anda diproyeksikan kehilangan uang lebih cepat daripada mendapatkannya. Pertimbangkan untuk memperbesar Target Profit atau memperbaiki Win Rate Anda.";

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
            {statusTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{statusMessage}</p>
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
                <p className="text-sm text-muted-foreground">Net Profit per Trade</p>
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
                        Inti dari analisis ini adalah rumus ekspektasi: <strong>E = [Win % * Avg. Win] - [Loss % * Avg. Loss]</strong>. Dalam kasus Anda:
                    </p>
                     <ul className="list-disc space-y-1 pl-5">
                       <li><strong>Average Win (Aw):</strong> {formatRupiah(avgWin)}</li>
                        <li><strong>Average Loss (Al):</strong> {formatRupiah(riskAmount)}</li>
                    </ul>
                    <p>
                        Ekspektasi positif berarti, dalam jumlah trade yang besar, total keuntungan Anda akan melebihi total kerugian, yang mengarah pada profitabilitas bersih. Ekspektasi negatif menunjukkan sistem yang cacat dan secara statistik dijamin akan kehilangan uang seiring waktu.
                    </p>
                </div>
                <div>
                    <h4 className="mb-1 font-semibold text-foreground">Understanding Your "Edge"</h4>
                     <p>
                        "Edge" adalah keunggulan statistik atas pasar. <strong>Net Profit per Trade</strong> Anda sebesar {formatRupiah(nominalExpectancy)} adalah nilai moneter dari edge Anda per transaksi. <strong>Rasio Ekspektasi</strong> sebesar {(expectancyRatio * 100).toFixed(2)}% memberitahu hal yang sama, tetapi sebagai persentase dari modal yang Anda risikokan. Untuk setiap {formatRupiah(1)} yang Anda pertaruhkan, Anda secara statistik dapat mengharapkan keuntungan sebesar {formatRupiah(nominalExpectancy / riskAmount)} dalam jangka panjang.
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
                        Hedge fund dan firma trading profesional hidup dan mati berdasarkan ekspektasi. Tidak ada strategi yang digunakan dengan modal institusional kecuali menunjukkan *edge* positif yang persisten, sekecil apa pun itu. Kunci utamanya adalah hubungan antara Win Rate dan Risk:Reward Ratio.
                    </p>
                     <ul className='list-disc space-y-1 pl-5'>
                        <li><strong>Fair Game (Baseline):</strong> Ini adalah titik awal 50%, di mana peluang menang dan kalah seimbang. Strategi Anda harus memiliki ekspektasi positif dari titik ini untuk dianggap layak.</li>
                        <li><strong>Retail Beginner:</strong> Profil ini seringkali beroperasi dengan Win Rate di bawah 50% karena faktor emosional. Profil ini menetapkan Win Rate ke 45% sebagai skenario realistis.</li>
                        <li><strong>Professional Trader:</strong> Trader yang disiplin mencapai Win Rate antara 55-60% pada strategi seperti *day trading*. Profil ini menggunakan 58% sebagai acuan.</li>
                        <li><strong>Institutional System:</strong> Sistem trading besar (seperti *Trend Following*) seringkali memiliki Win Rate rendah (30-40%) tetapi R:R sangat besar (1:5, 1:10, atau lebih) untuk mengimbanginya. Profil ini menggunakan 35%.</li>
                    </ul>
                    <p>
                        Strategi Anda, dengan Win Rate {result.winRate}% dan R:R 1:{riskRewardRatio.toFixed(2)}, memiliki profil tertentu. Tujuannya bukan hanya untuk memiliki ekspektasi positif, tetapi untuk memahami karakteristiknya agar dapat mengelola psikologi dan alokasi modal Anda secara efektif.
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
