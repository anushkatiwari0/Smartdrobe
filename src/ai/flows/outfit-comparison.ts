
'use server';

/**
 * @fileOverview An AI-powered tool to compare two outfits and recommend the best one.
 *
 * - compareOutfits - A function that returns a comparison and recommendation for two outfits.
 * - OutfitComparisonInput - The input type for the compareOutfits function.
 * - OutfitComparisonOutput - The return type for the compareOutfits function.
 */

import { ai, GEMINI_MODEL } from '@/ai/genkit';
import { z } from 'zod';
import {
  OutfitComparisonInputSchema,
  OutfitComparisonOutputSchema,
  type OutfitComparisonInput,
  type OutfitComparisonOutput,
} from '@/lib/types';


async function generateImageForOutfit(
  description?: string,
  dataUri?: string
): Promise<string> {
  if (dataUri) {
    return dataUri;
  }
  // If only a description is provided, immediately return a placeholder.
  // The AI image generation has been removed to prevent API errors.
  if (description) {
    return `https://placehold.co/400x500.png?text=Outfit+Preview`;
  }
  // This is a fallback and should ideally not be reached if validation is correct.
  return 'https://placehold.co/400x500.png?text=No+Image';
}

export async function compareOutfits(
  input: OutfitComparisonInput
): Promise<OutfitComparisonOutput> {
  return compareOutfitsFlow(input);
}

const comparisonOutputSchema = z.object({
  recommendation: z
    .enum(['A', 'B'])
    .describe("The final recommendation, indicating which outfit is preferred ('A' or 'B')."),
  verdict: z
    .string()
    .describe(
      'A concise, one-sentence explanation for the verdict. Example: "Outfit B looks better for a casual brunch because of its lighter tones and relaxed fit."'
    ),
  outfitAAnalysis: z.object({
    improvementTips: z
      .array(z.string())
      .describe('A list of 1-2 actionable tips to improve Outfit A.'),
  }),
  outfitBAnalysis: z.object({
    improvementTips: z
      .array(z.string())
      .describe('A list of 1-2 actionable tips to improve Outfit B.'),
  }),
});

const compareOutfitsFlow = ai.defineFlow(
  {
    name: 'compareOutfitsFlow',
    inputSchema: OutfitComparisonInputSchema,
    outputSchema: OutfitComparisonOutputSchema,
  },
  async (input) => {
    
    const [outfitAImageUrl, outfitBImageUrl] = await Promise.all([
        generateImageForOutfit(input.outfitADescription, input.outfitADataUri),
        generateImageForOutfit(input.outfitBDescription, input.outfitBDataUri),
    ]);

    const prompt = ai.definePrompt({
        name: 'outfitComparisonPrompt',
        output: { schema: comparisonOutputSchema },
        model: GEMINI_MODEL,
        prompt: `You are an expert fashion stylist. Compare the two outfits provided below and decide which one is better for the specified occasion: **{{{occasion}}}**.

Your analysis must be detailed and constructive.

**Outfit A:**
${input.outfitADescription || 'See image A.'}
{{media url=outfitAImageUrl}}

**Outfit B:**
${input.outfitBDescription || 'See image B.'}
{{media url=outfitBImageUrl}}

**Analysis Steps:**
1.  **Make a Recommendation**: Choose which outfit ('A' or 'B') is superior for the occasion.
2.  **Write the Verdict**: Provide a concise, one-sentence verdict explaining your choice.
3.  **Provide Improvement Tips**: For EACH outfit (A and B), provide 1-2 separate, actionable tips for how it could be improved.
`,
    });

    const { output } = await prompt({ outfitAImageUrl, outfitBImageUrl, occasion: input.occasion });
    
    if (!output) {
        throw new Error("Failed to get comparison from the model.");
    }
    
    return {
        ...output,
        outfitAImageUrl,
        outfitBImageUrl,
    };
  }
);
