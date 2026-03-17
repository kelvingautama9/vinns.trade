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
import { formatRupiah, cn } from '@/lib/utils';
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

export function ResultsDisplay({ result, isLoading }: ResultsDisplayProps) {
  const [visibleLines, setVisibleLines] = useState(initialVisibleLines);

  const handleLineVisibilityChange = (key: string) => {
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
    inflationRate,
  } = result;

  const shortfall = targetAmount - finalNominalValue;
  const principalPercentage = (totalInvestment / finalNominalValue) * 100;
  const interestPercentage = 100 - principalPercentage;
  const lastYearData = chartData[chartData.length - 1];

  return (
    <div className="space-y-6">
      {!isTargetMet && (
        <Alert variant="destructive" className="bg-red-900/20 border-red-500/30">
          <Frown className="h-4 w-4" />
          <AlertTitle>Strategy Needs Adjustment</AlertTitle>
          <AlertDescription>
            Your current strategy may not be enough to reach your financial goal. Consider the recommendations below.
          </AlertDescription>
        </Alert>
      )}

      {isTargetMet && (
         <Alert className="bg-green-900/20 border-green-500/30">
          <Sparkles className="h-4 w-4 text-green-400" />
          <AlertTitle className="text-green-300">Congratulations!</AlertTitle>
          <AlertDescription className="text-green-400">
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
                 <div className="rounded-lg p-4 bg-white/5">
                    <p className="text-sm text-muted-foreground">Your Goal</p>
                    <p className="text-2xl font-bold">{formatRupiah(targetAmount)}</p>
                </div>
                 <div className="rounded-lg p-4 bg-white/5">
                    <p className="text-sm text-muted-foreground">Projected Value</p>
                    <p className={cn(
                        "text-2xl font-bold",
                        isTargetMet ? "text-green-400" : "text-red-400"
                    )}>{formatRupiah(finalNominalValue)}</p>
                </div>
            </div>
            {!isTargetMet && shortfall > 0 && (
                <div className="text-center font-medium text-red-400">
                    You are short by {formatRupiah(shortfall)}
                </div>
            )}
            <div className="space-y-2 pt-2">
                <div className="flex justify-between text-sm font-medium text-muted-foreground">
                    <span>Principal: {formatRupiah(totalInvestment)} ({principalPercentage.toFixed(0)}%)</span>
                    <span>Interest: {formatRupiah(totalInterest)} ({interestPercentage.toFixed(0)}%)</span>
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
                        <TabsContent key={rec.type} value={rec.type} className="mt-4 text-center p-2 prose prose-sm dark:prose-invert max-w-none">
                            {rec.type === 'increaseMonthlySavings' && (
                                <p>To reach your goal with your current timeline and return rate, you could increase your monthly savings to <strong className="text-primary">{formatRupiah(rec.value)}</strong>. This adjustment targets your goal of {formatRupiah(targetAmount)}.</p>
                            )}
                             {rec.type === 'extendTimeHorizon' && (
                                realRateIsNegative ? (
                                    <div>
                                        <p className="font-medium text-destructive">
                                            Your return rate ({result.expectedReturnRate}%) is below inflation ({inflationRate}%). Extending time will only <strong className='text-destructive'>decrease</strong> your money's real value.
                                        </p>
                                        <p className="text-muted-foreground mt-2">
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
        <AccordionItem value="item-1" className="rounded-2xl border border-white/10 bg-card/70 text-card-foreground shadow-xl backdrop-blur-lg">
          <AccordionTrigger className="px-6 hover:no-underline">
            <div className="flex items-center gap-2 text-base font-semibold">
              <Info className="h-5 w-5 text-primary" />
              <span>Memahami Proyeksi Nilai</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6">
            <div className="prose prose-sm dark:prose-invert max-w-none space-y-4 text-muted-foreground">
                <div>
                    <h4 className="mb-1 font-semibold text-foreground">Nilai Nominal (Garis Biru)</h4>
                    <p>
                        <strong>Apa itu:</strong> Ini adalah jumlah uang <strong>aktual</strong> yang akan ada di akun investasi Anda di masa depan. Jika kalkulator memproyeksikan Anda akan memiliki Rp 1 Miliar dalam 10 tahun, inilah angka yang akan Anda lihat di rekening Anda.
                        <br />
                        <strong>Keterbatasan:</strong> Angka ini tidak memperhitungkan bahwa harga barang dan jasa akan naik seiring waktu (karena inflasi). Jadi, meskipun angkanya besar, daya belinya mungkin tidak sebesar yang Anda kira.
                    </p>
                </div>
                <div>
                    <h4 className="mb-1 font-semibold text-foreground">Nilai Riil (Garis Hijau)</h4>
                     <p>
                        <strong>Apa itu:</strong> Ini adalah <strong>daya beli sesungguhnya</strong> dari uang Anda di masa depan, yang diukur dengan nilai uang hari ini. Garis ini menjawab pertanyaan: "Jika saya memiliki Rp 1 Miliar dalam 10 tahun, berapa nilainya jika dibandingkan dengan uang hari ini?"
                         <br />
                        <strong>Mengapa ini Penting:</strong> Inilah ukuran kekayaan Anda yang paling jujur. Garis ini menunjukkan apakah investasi Anda benar-benar tumbuh lebih cepat daripada kenaikan harga-harga. Jika garis Nilai Riil menanjak, berarti kekayaan Anda secara efektif bertambah.
                    </p>
                </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-2" className="rounded-2xl border border-white/10 bg-card/70 text-card-foreground shadow-xl backdrop-blur-lg">
          <AccordionTrigger className="px-6 hover:no-underline">
            <div className="flex items-center gap-2 text-base font-semibold">
              <HelpCircle className="h-5 w-5 text-primary" />
              <span>Memahami Skenario Alternatif</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6">
            <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-muted-foreground">
                <div>
                    <h4 className="mb-1 flex items-center gap-2 font-semibold text-foreground"><ShieldCheck className="text-red-400" />Skenario Tanpa Investasi (Garis Merah)</h4>
                    <p>
                        <strong>Analisis:</strong> Garis ini adalah benchmark terpenting Anda; ia menunjukkan biaya peluang (opportunity cost) jika tidak berinvestasi. Anda bisa melihat dengan jelas bagaimana inflasi menggerus daya beli tabungan Anda dari waktu ke waktu, bahkan saat Anda terus menabung. Ini adalah skenario "terburuk" untuk pertumbuhan kekayaan jangka panjang.
                    </p>
                </div>
                 <div>
                    <h4 className="mb-1 flex items-center gap-2 font-semibold text-foreground"><Turtle className="text-yellow-400" />Skenario Konservatif (6% Return)</h4>
                    <p>
                        <strong>Profil Risiko:</strong> Sangat Rendah. Fokus utama adalah melindungi modal dari inflasi sambil mendapatkan sedikit pertumbuhan. Cocok untuk investor yang tidak ingin mengambil risiko atau untuk tujuan keuangan jangka pendek (1-3 tahun).
                    </p>
                    <p><strong>Contoh Aset:</strong></p>
                    <ul className='list-disc pl-5'>
                        <li><strong>Obligasi Pemerintah (SBN/FR):</strong> Dianggap sebagai aset paling aman karena dijamin oleh negara. Waktu terbaik untuk masuk adalah saat suku bunga acuan sedang tinggi, karena ini mengunci yield yang lebih tinggi untuk tahun-tahun mendatang.</li>
                        <li><strong>Deposito Bank Digital (BPR):</strong> Menawarkan bunga lebih tinggi dari bank konvensional dan dijamin oleh LPS hingga batas tertentu. Cocok untuk menyimpan dana darurat atau dana jangka pendek.</li>
                        <li><strong>Reksadana Pasar Uang:</strong> Portofolio yang sangat likuid berisi instrumen pasar uang dengan jatuh tempo di bawah 1 tahun. Hampir tidak memiliki risiko penurunan nilai pokok.</li>
                    </ul>
                </div>
                 <div>
                    <h4 className="mb-1 flex items-center gap-2 font-semibold text-foreground"><Rabbit className="text-purple-400" />Skenario Agresif (20% Return)</h4>
                    <p>
                         <strong>Profil Risiko:</strong> Tinggi. Skenario ini bertujuan untuk pertumbuhan modal yang maksimal dan bersedia menerima volatilitas harga yang signifikan dalam jangka pendek. Cocok untuk investor dengan horizon waktu panjang (5+ tahun).
                    </p>
                     <p><strong>Contoh Aset (dengan diversifikasi):</strong></p>
                    <ul className='list-disc pl-5'>
                        <li><strong>Indeks Saham AS (ETF: VOO/IVV, QQQ):</strong> Daripada memilih satu saham, Anda membeli "sekeranjang" saham dari 500 atau 100 perusahaan terbesar di AS. Waktu terbaik untuk akumulasi adalah secara berkala (Dollar Cost Averaging/DCA) setiap bulan, terutama saat pasar sedang terkoreksi (turun). Ini adalah strategi inti yang digunakan oleh banyak investor sukses seperti Warren Buffett.</li>
                        <li><strong>Aset Digital (Bitcoin, Ethereum):</strong> Memiliki potensi return tertinggi dengan risiko tertinggi. Alokasikan porsi kecil dari portofolio (1-5%). Waktu terbaik untuk membeli adalah saat pasar sedang "takut" atau setelah penurunan besar (bear market), bukan saat semua orang membicarakannya (bull market peak).</li>
                        <li><strong>Reksadana Saham Teknologi/Indeks Teknologi:</strong> Berinvestasi pada sektor yang mendorong inovasi. Seperti indeks saham, DCA adalah strategi yang paling bijaksana. Sektor ini cenderung memimpin saat ekonomi sedang berekspansi.</li>
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
