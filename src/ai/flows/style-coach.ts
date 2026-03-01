
'use server';
/**
 * @fileOverview An AI Style Coach that provides feedback on an outfit photo.
 *
 * - getStyleFeedback - Analyzes an outfit photo and provides scores and suggestions.
 * - StyleCoachInput - The input type for the getStyleFeedback function.
 * - StyleCoachOutput - The return type for the getStyleFeedback function.
 */

import { ai, GEMINI_MODEL } from '@/ai/genkit';
import { z } from 'zod';
import {
  StyleCoachInputSchema,
  StyleCoachOutputSchema,
  type StyleCoachInput,
} from '@/lib/types';

export type StyleCoachOutput = z.infer<typeof StyleCoachOutputSchema>;

export async function getStyleFeedback(
  input: StyleCoachInput
): Promise<StyleCoachOutput> {
  return styleCoachFlow(input);
}

const prompt = ai.definePrompt({
  name: 'styleCoachPrompt',
  input: { schema: StyleCoachInputSchema },
  output: { schema: StyleCoachOutputSchema },
  model: GEMINI_MODEL,
  prompt: `You are a friendly, encouraging, and expert AI Style Coach. Analyze the user's outfit photo provided.

Image: {{media url=photoDataUri}}
Occasion: {{{occasion}}}

Your task is to provide constructive feedback in the following areas:

1.  **Harmony Score**: Rate the color and pattern harmony of the outfit from 1 to 100. A high score means the colors and patterns work well together.
2.  **Trend Score**: Rate how trendy and current the outfit is from 1 to 100. A high score means it aligns with current fashion trends.
3.  **Feedback**: Provide a single, actionable, and encouraging feedback tip. This should be a friendly suggestion for how to elevate the look. For example, "This is a great start! Tucking in the shirt and adding a statement belt could really define your waist and complete the look." or "Love the color palette! For a more balanced silhouette, you could try a wider-leg pant."

Keep the tone positive and helpful. The goal is to empower the user to feel more confident in their style choices.
`,
});

const styleCoachFlow = ai.defineFlow(
  {
    name: 'styleCoachFlow',
    inputSchema: StyleCoachInputSchema,
    outputSchema: StyleCoachOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
