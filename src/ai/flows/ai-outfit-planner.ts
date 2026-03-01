
// This is an AI outfit planner flow.

'use server';

/**
 * @fileOverview Generates outfit suggestions based on user preferences, weather, mood, and occasion.
 *
 * - aiOutfitPlanner - A function that returns an outfit suggestion with explanation.
 * - AiOutfitPlannerInput - The input type for the aiOutfitPlanner function.
 * - AiOutfitPlannerOutput - The return type for the aiOutfitPlanner function.
 */

import { ai, GEMINI_MODEL } from '@/ai/genkit';
import {z} from 'genkit';

const AiOutfitPlannerInputSchema = z.object({
  weather: z
    .string()
    .describe('The current weather conditions, e.g., sunny, rainy, cold.'),
  mood: z.string().describe('The user’s current mood, e.g., happy, relaxed, energetic.'),
  occasion: z
    .string()
    .describe('The occasion for which the outfit is needed, e.g., work, party, casual.'),
  stylePreferences: z
    .string()
    .describe('The user’s style preferences, e.g., minimalist, bohemian, classic.'),
});
export type AiOutfitPlannerInput = z.infer<typeof AiOutfitPlannerInputSchema>;

const AiOutfitPlannerOutputSchema = z.object({
  outfitSuggestion: z.string().describe('A complete outfit suggestion.'),
  explanation: z.string().describe('An explanation of why the outfit is suitable.'),
});
export type AiOutfitPlannerOutput = z.infer<typeof AiOutfitPlannerOutputSchema>;

export async function aiOutfitPlanner(input: AiOutfitPlannerInput): Promise<AiOutfitPlannerOutput> {
  return aiOutfitPlannerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiOutfitPlannerPrompt',
  input: {schema: AiOutfitPlannerInputSchema},
  output: {schema: AiOutfitPlannerOutputSchema},
  model: GEMINI_MODEL,
  prompt: `Suggest a complete outfit and explain why it is suitable based on the following information:

Weather: {{{weather}}}
Mood: {{{mood}}}
Occasion: {{{occasion}}}
Style Preferences: {{{stylePreferences}}}

Outfit Suggestion:
Explanation: `,
});

const aiOutfitPlannerFlow = ai.defineFlow(
  {
    name: 'aiOutfitPlannerFlow',
    inputSchema: AiOutfitPlannerInputSchema,
    outputSchema: AiOutfitPlannerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
