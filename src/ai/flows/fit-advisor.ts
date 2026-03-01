
// This is a server-side file.
'use server';

/**
 * @fileOverview An AI-powered fit advisor that provides personalized style advice.
 *
 * - getFitAdvice - A function that returns tailored fashion advice.
 * - FitAdvisorInput - The input type for the getFitAdvice function.
 * - FitAdvisorOutput - The return type for the getFitAdvice function.
 */

import { ai, GEMINI_MODEL } from '@/ai/genkit';
import { z } from 'zod';
import {
  FitAdvisorInputSchema,
  FitAdvisorOutputSchema,
  type FitAdvisorInput,
  type FitAdvisorOutput,
} from '@/lib/types';

export async function getFitAdvice(input: FitAdvisorInput): Promise<FitAdvisorOutput> {
  return fitAdvisorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'fitAdvisorPrompt',
  input: { schema: FitAdvisorInputSchema },
  output: { schema: FitAdvisorOutputSchema },
  model: GEMINI_MODEL,
  prompt: `You are an expert personal stylist specializing in body shapes and fit. A user has provided their body profile. Your task is to provide clear, encouraging, and actionable fashion advice.

User's Profile:
- Gender: {{{gender}}}
- Body Shape: {{{bodyShape}}}
- Height: {{{height}}}
- Weight: {{{weight}}}
- Fit Preference: {{{fitPreference}}}

Based on this profile, generate the following:

- **Fashion Do's**: Suggest 3-4 specific types of clothing, cuts, or styles that would be particularly flattering. Explain briefly WHY each works (e.g., "A-line skirts highlight the waist and skim over the hips.").
- **Fashion Don'ts**: Suggest 2-3 styles or cuts that the user might want to be cautious with. Frame this constructively, explaining the effect (e.g., "Puff sleeves can add volume to the shoulder line, which you may want to balance with a fuller skirt.").
- **Shopping Suggestions**: Suggest 2-3 specific types of clothing items to purchase that would be a great addition to their wardrobe. For each, provide the 'itemName' and a 'reason' why it would be a valuable purchase for them.

Keep the tone positive and empowering. The goal is to help the user feel confident, not restricted.
`,
});

const fitAdvisorFlow = ai.defineFlow(
  {
    name: 'fitAdvisorFlow',
    inputSchema: FitAdvisorInputSchema,
    outputSchema: FitAdvisorOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
