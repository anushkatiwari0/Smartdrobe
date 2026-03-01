
'use server';

/**
 * @fileOverview Generates a daily fashion tip.
 *
 * - generateDailyStyleTip - A function that generates a daily style tip.
 * - DailyStyleTipOutput - The output type for the generateDailyStyleTip function.
 */

import { ai, GEMINI_MODEL } from '@/ai/genkit';
import {z} from 'genkit';

const DailyStyleTipOutputSchema = z.object({
  tip: z.string().describe('A concise, AI-generated fashion tip for the day.'),
});
export type DailyStyleTipOutput = z.infer<typeof DailyStyleTipOutputSchema>;

// A list of static tips to prevent API errors.
const staticTips = [
    "Balance a voluminous piece with something more fitted for a chic silhouette.", // Sunday
    "Tuck in your shirt to instantly define your waist and look more polished.", // Monday
    "Don't be afraid to mix prints! Start with two that share a common color.", // Tuesday
    "A statement belt can completely transform a simple dress or oversized shirt.", // Wednesday
    "Roll up your sleeves or cuff your jeans for an effortlessly cool, laid-back vibe.", // Thursday
    "Invest in a quality trench coat; it's a timeless piece that elevates any outfit.", // Friday
    "When in doubt, a monochrome outfit always looks sophisticated and put-together.", // Saturday
];


export async function generateDailyStyleTip(): Promise<DailyStyleTipOutput> {
  // This flow has been modified to return a static tip to prevent API quota errors.
  // To re-enable AI-generated tips, you will need to ensure your GEMINI_API_KEY is for a project
  // with the 'Generative Language API' or 'Vertex AI API' enabled and billing set up.
  const dayOfWeek = new Date().getDay();
  const tip = staticTips[dayOfWeek];
  return { tip };
}


// The original AI flow is preserved below but is not currently used.
/*
const prompt = ai.definePrompt({
  name: 'dailyStyleTipPrompt',
  output: {schema: DailyStyleTipOutputSchema},
  model: GEMINI_MODEL,
  prompt: 'Generate a concise and creative fashion tip for the day.',
});

const dailyStyleTipFlow = ai.defineFlow(
  {
    name: 'dailyStyleTipFlow',
    outputSchema: DailyStyleTipOutputSchema,
  },
  async () => {
    const {output} = await prompt({});
    return output!;
  }
);

// To re-enable, change the export above to:
// export async function generateDailyStyleTip(): Promise<DailyStyleTipOutput> {
//   return dailyStyleTipFlow();
// }
*/
