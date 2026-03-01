
// This is a server-side file.
'use server';

/**
 * @fileOverview Generates an aesthetic moodboard from a selection of clothing items.
 *
 * - generateMoodboard - A function that generates a moodboard analysis.
 * - MoodboardGeneratorInput - The input type for the function.
 * - MoodboardGeneratorOutput - The return type for the function.
 */

import { ai, GEMINI_MODEL } from '@/ai/genkit';
import {z} from 'genkit';
import type { ClosetItem } from '@/lib/types';

const ClosetItemSchema = z.object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
    description: z.string(),
    imageUrl: z.string(),
    aiHint: z.string(),
});

const MoodboardGeneratorInputSchema = z.object({
  items: z.array(ClosetItemSchema).describe("A list of 3-5 clothing items selected by the user for the moodboard."),
});
export type MoodboardGeneratorInput = z.infer<typeof MoodboardGeneratorInputSchema>;

const MoodboardGeneratorOutputSchema = z.object({
    title: z.string().describe("A creative, catchy title for the moodboard (e.g., 'Minimalist Monday', 'Urban Explorer', 'Weekend Wanderer')."),
    description: z.string().describe("A brief, 1-2 sentence description of the moodboard's overall vibe and style."),
    colorPalette: z.array(z.string()).describe("An array of 4-5 hex color codes that represent the moodboard's theme."),
});
export type MoodboardGeneratorOutput = z.infer<typeof MoodboardGeneratorOutputSchema>;

export async function generateMoodboard(input: MoodboardGeneratorInput): Promise<MoodboardGeneratorOutput> {
  return moodboardGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'moodboardGeneratorPrompt',
  input: {schema: MoodboardGeneratorInputSchema},
  output: {schema: MoodboardGeneratorOutputSchema},
  model: GEMINI_MODEL,
  prompt: `You are a fashion stylist and art director creating a moodboard. Based on the following clothing items, generate a cohesive aesthetic.

Selected Items:
{{#each items}}
- {{name}} ({{category}}): {{description}}
{{/each}}

Your task is to:
1.  **Create a Title**: Invent a short, creative, and evocative title for this collection (e.g., "Autumn in the City", "Coastal Grandmother Chic", "Techwear Futurist").
2.  **Write a Description**: Provide a 1-2 sentence summary that captures the mood and essence of this style.
3.  **Generate a Color Palette**: Identify a palette of 4-5 key colors from the items. Provide these as an array of hex color strings. Choose colors that are harmonious and representative of the overall look.
`
});

const moodboardGeneratorFlow = ai.defineFlow(
  {
    name: 'moodboardGeneratorFlow',
    inputSchema: MoodboardGeneratorInputSchema,
    outputSchema: MoodboardGeneratorOutputSchema,
  },
  async input => {
    if (input.items.length < 3) {
        throw new Error("Please select at least 3 items to generate a moodboard.");
    }
    const {output} = await prompt(input);
    return output!;
  }
);
