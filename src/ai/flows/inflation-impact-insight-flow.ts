'use server';
/**
 * @fileOverview A Genkit flow that generates a personalized explanation of the 'Loss of Purchasing Power'
 * in Rupiah, comparing an investment strategy against a standard savings account under inflation.
 *
 * - inflationImpactInsight - A function that handles the inflation impact explanation process.
 * - InflationImpactInsightInput - The input type for the inflationImpactInsight function.
 * - InflationImpactInsightOutput - The return type for the inflationImpactInsight function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const InflationImpactInsightInputSchema = z.object({
  currentSavings: z
    .number()
    .min(0, 'Current savings cannot be negative.')
    .describe('Current amount of savings in Rupiah (Rp).'),
  monthlySavings: z
    .number()
    .min(0, 'Monthly savings cannot be negative.')
    .describe('Amount saved monthly in Rupiah (Rp).'),
  expectedReturnRate: z
    .number()
    .min(0, 'Expected return rate cannot be negative.')
    .max(100, 'Expected return rate cannot exceed 100%.')
    .describe('Expected annual return rate of the investment (%).'),
  inflationRate: z
    .number()
    .min(0, 'Inflation rate cannot be negative.')
    .max(100, 'Inflation rate cannot exceed 100%.')
    .describe('Annual inflation rate (%).'),
  timeHorizonYears: z
    .number()
    .min(1, 'Time horizon must be at least 1 year.')
    .max(100, 'Time horizon cannot exceed 100 years.')
    .describe('Investment time horizon in years.'),
  annuityType: z
    .enum(['ordinary', 'due'])
    .describe(
      'Type of annuity: "ordinary" (deposit at end of month) or "due" (deposit at start of month).'
    )
    .default('ordinary'),
});
export type InflationImpactInsightInput = z.infer<
  typeof InflationImpactInsightInputSchema
>;

const InflationImpactInsightOutputSchema = z
  .string()
  .describe(
    'A personalized explanation of the loss of purchasing power in Rupiah.'
  );
export type InflationImpactInsightOutput = z.infer<
  typeof InflationImpactInsightOutputSchema
>;

// Internal schema for the prompt, including pre-calculated and formatted values
const PromptInputSchema = z.object({
  currentSavings: z.number(),
  monthlySavings: z.number(),
  expectedReturnRate: z.number(),
  inflationRate: z.number(),
  timeHorizonYears: z.number(),
  annuityType: z.enum(['ordinary', 'due']),
  nominalFutureValueInvestment: z
    .string()
    .describe('Formatted Nominal Future Value of the investment strategy.'),
  realFutureValueInvestment: z
    .string()
    .describe(
      "Formatted Real Future Value of the investment strategy (today's purchasing power)."
    ),
  futureValueSavingsInflationAdjusted: z
    .string()
    .describe(
      'Formatted Future Purchasing Power of savings in a standard bank account (0% nominal return) after inflation.'
    ),
  purchasingPowerBenefit: z
    .string()
    .describe(
      'Formatted difference in purchasing power between the investment and a standard savings account.'
    ),
});

/**
 * Helper function to format a number as Rupiah currency string.
 */
function formatRupiah(amount: number): string {
  return amount.toLocaleString('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

/**
 * Helper function to calculate the Future Value (FV) of a lump sum.
 * @param pv Present Value.
 * @param rate Periodic interest rate.
 * @param periods Number of periods.
 * @returns Future Value.
 */
function calculateFvLumpSum(pv: number, rate: number, periods: number): number {
  return pv * Math.pow(1 + rate, periods);
}

/**
 * Helper function to calculate the Future Value (FV) of an annuity.
 * Handles both ordinary annuity (end of period) and annuity due (beginning of period).
 * @param payment Periodic payment.
 * @param rate Periodic interest rate.
 * @param periods Number of periods.
 * @param type Type of annuity: 'ordinary' or 'due'.
 * @returns Future Value of the annuity.
 */
function calculateFvAnnuity(
  payment: number,
  rate: number,
  periods: number,
  type: 'ordinary' | 'due'
): number {
  if (rate === 0) {
    return payment * periods;
  }
  const fv = payment * ((Math.pow(1 + rate, periods) - 1) / rate);
  return type === 'due' ? fv * (1 + rate) : fv;
}

const prompt = ai.definePrompt({
  name: 'inflationImpactInsightPrompt',
  input: { schema: PromptInputSchema },
  output: { schema: InflationImpactInsightOutputSchema },
  prompt: `Sebagai seorang pakar keuangan, saya akan menganalisis dampak inflasi terhadap strategi investasi Anda.

Dengan {{timeHorizonYears}} tahun ke depan, jika Anda berinvestasi dengan modal awal Rp {{currentSavings}} dan tambahan Rp {{monthlySavings}} setiap bulan pada tingkat pengembalian tahunan {{expectedReturnRate}}%, inilah proyeksi hasilnya:

**Proyeksi Nilai Nominal (tanpa mempertimbangkan inflasi):**
Investasi Anda diproyeksikan mencapai sekitar **{{nominalFutureValueInvestment}}**. Ini adalah angka yang terlihat di rekening Anda.

**Proyeksi Nilai Riil (daya beli hari ini setelah inflasi):**
Mengingat tingkat inflasi tahunan {{inflationRate}}%, daya beli riil investasi Anda di masa depan setara dengan **{{realFutureValueInvestment}}** dalam nilai uang hari ini.

**Bandingkan dengan hanya menabung di Bank Biasa (dengan 0% pengembalian nominal):**
Jika Anda hanya menyimpan dana Rp {{currentSavings}} dan menambahkan Rp {{monthlySavings}} setiap bulan di rekening bank biasa yang tidak memberikan pengembalian nominal (0%), daya beli riil dari total tabungan Anda di masa depan akan menyusut menjadi sekitar **{{futureValueSavingsInflationAdjusted}}** dalam nilai uang hari ini.

**Wawasan 'Loss of Purchasing Power':**
Strategi investasi Anda berpotensi meningkatkan daya beli riil Anda sebesar **{{purchasingPowerBenefit}}** dibandingkan dengan hanya menabung di rekening bank biasa. Tanpa investasi, inflasi akan mengikis daya beli tabungan Anda secara signifikan. Ini berarti dengan strategi investasi ini, Anda tidak hanya melindungi, tetapi juga menumbuhkan daya beli aset Anda secara substansial di masa depan, mengurangi "Loss of Purchasing Power" yang fatal akibat inflasi.

Pastikan untuk mempertimbangkan pajak dan biaya lain yang relevan dalam perencanaan keuangan Anda.`,
});

const inflationImpactInsightFlow = ai.defineFlow(
  {
    name: 'inflationImpactInsightFlow',
    inputSchema: InflationImpactInsightInputSchema,
    outputSchema: InflationImpactInsightOutputSchema,
  },
  async (input) => {
    // Convert percentages to decimals
    const annualNominalRateDecimal = input.expectedReturnRate / 100;
    const annualInflationRateDecimal = input.inflationRate / 100;

    // Calculate total months
    const timeHorizonMonths = input.timeHorizonYears * 12;

    // Calculate monthly nominal rate for investment
    const monthlyNominalRate =
      Math.pow(1 + annualNominalRateDecimal, 1 / 12) - 1;

    // 1. Calculate Nominal Future Value of Investment
    let nominalFutureValueInvestment = 0;
    if (input.currentSavings > 0) {
      nominalFutureValueInvestment += calculateFvLumpSum(
        input.currentSavings,
        monthlyNominalRate,
        timeHorizonMonths
      );
    }
    if (input.monthlySavings > 0) {
      nominalFutureValueInvestment += calculateFvAnnuity(
        input.monthlySavings,
        monthlyNominalRate,
        timeHorizonMonths,
        input.annuityType
      );
    }

    // 2. Calculate Annual Real Rate of Return (Fisher Equation)
    // Avoid division by zero if (1 + annualInflationRateDecimal) is 0, though highly unlikely for inflation.
    let annualRealRate;
    if (1 + annualInflationRateDecimal <= 0) {
      // Handle extreme case, e.g., deflation so severe it makes denominator <= 0
      annualRealRate = annualNominalRateDecimal;
    } else {
      annualRealRate =
        (1 + annualNominalRateDecimal) / (1 + annualInflationRateDecimal) - 1;
    }

    // Calculate monthly real rate
    const monthlyRealRate = Math.pow(1 + annualRealRate, 1 / 12) - 1;

    // 3. Calculate Real Future Value of Investment
    let realFutureValueInvestment = 0;
    if (input.currentSavings > 0) {
      realFutureValueInvestment += calculateFvLumpSum(
        input.currentSavings,
        monthlyRealRate,
        timeHorizonMonths
      );
    }
    if (input.monthlySavings > 0) {
      realFutureValueInvestment += calculateFvAnnuity(
        input.monthlySavings,
        monthlyRealRate,
        timeHorizonMonths,
        input.annuityType
      );
    }

    // 4. Calculate Future Purchasing Power of Savings (0% Nominal Return, only inflation erosion)
    // For a savings account with 0% nominal return, the effective annual real rate is:
    let annualRealRateForSavings;
    if (1 + annualInflationRateDecimal <= 0) {
      annualRealRateForSavings = 0; // If inflation denominator is problematic, assume no real loss/gain for 0% nominal
    } else {
      annualRealRateForSavings =
        (1 + 0) / (1 + annualInflationRateDecimal) - 1;
    }
    const monthlyRealRateForSavings =
      Math.pow(1 + annualRealRateForSavings, 1 / 12) - 1;

    let futureValueSavingsInflationAdjusted = 0;
    if (input.currentSavings > 0) {
      futureValueSavingsInflationAdjusted += calculateFvLumpSum(
        input.currentSavings,
        monthlyRealRateForSavings,
        timeHorizonMonths
      );
    }
    if (input.monthlySavings > 0) {
      futureValueSavingsInflationAdjusted += calculateFvAnnuity(
        input.monthlySavings,
        monthlyRealRateForSavings,
        timeHorizonMonths,
        input.annuityType
      );
    }

    // 5. Calculate Purchasing Power Benefit
    const purchasingPowerBenefit =
      realFutureValueInvestment - futureValueSavingsInflationAdjusted;

    // Prepare data for the prompt, including formatted values
    const promptInputData = {
      ...input,
      nominalFutureValueInvestment: formatRupiah(nominalFutureValueInvestment),
      realFutureValueInvestment: formatRupiah(realFutureValueInvestment),
      futureValueSavingsInflationAdjusted: formatRupiah(
        futureValueSavingsInflationAdjusted
      ),
      purchasingPowerBenefit: formatRupiah(purchasingPowerBenefit),
    };

    const { output } = await prompt(promptInputData);
    return output!;
  }
);

export async function inflationImpactInsight(
  input: InflationImpactInsightInput
): Promise<InflationImpactInsightOutput> {
  return inflationImpactInsightFlow(input);
}
