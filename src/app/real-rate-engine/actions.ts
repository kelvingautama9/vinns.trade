'use server';
import {
  inflationImpactInsight,
  type InflationImpactInsightInput,
} from '@/ai/flows/inflation-impact-insight-flow';

export async function getInvestmentInsight(
  input: InflationImpactInsightInput
) {
  try {
    const insight = await inflationImpactInsight(input);
    return { data: insight, error: null };
  } catch (error) {
    console.error('Error getting investment insight:', error);
    return {
      data: null,
      error:
        'Failed to generate AI insight. Please check the inputs and try again.',
    };
  }
}
