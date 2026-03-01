
// This is a server-side file.
'use server';

/**
 * @fileOverview Generates outfit suggestions based on user's closet, occasion, weather, and mood.
 *
 * - generateQuickOutfit - A function that generates outfit suggestions.
 * - QuickOutfitGeneratorInput - The input type for the generateQuickOutfit function.
 * - QuickOutfitGeneratorOutput - The return type for the generateQuickOutfit function.
 */

import { ai, GEMINI_MODEL } from '@/ai/genkit';
import { z } from 'genkit';
import type { ClosetItem } from '@/lib/types';


const ClosetItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  aiHint: z.string(),
});

const QuickOutfitGeneratorInputSchema = z.object({
  occasion: z.string().describe('The occasion for the outfit (e.g., College, Party, Formal).'),
  weather: z.string().describe('The current weather (e.g., Sunny, Rainy, Cold).'),
  mood: z.string().describe('The user\'s current mood (e.g., Confident, Chill, Bold).'),
  closetItems: z.array(ClosetItemSchema).describe('A list of clothing items available in the user\'s closet.'),
});
export type QuickOutfitGeneratorInput = z.infer<typeof QuickOutfitGeneratorInputSchema>;

const QuickOutfitGeneratorOutputSchema = z.object({
  outfits: z.array(
    z.object({
      title: z.string().describe('A catchy title for the outfit suggestion.'),
      description: z.string().describe('A brief explanation of why this outfit works for the given inputs.'),
      reasoning: z.array(z.string()).describe('An array of 2-3 short, consumer-friendly bullet points explaining why the AI selected this outfit (e.g., "Great for sunny weather", "Comfortable for a casual day").'),
      items: z.array(z.string()).describe('An array of the exact item names from the closet that make up the outfit.'),
    })
  ).describe('An array of 1-2 complete outfit suggestions.'),
});
export type QuickOutfitGeneratorOutput = z.infer<typeof QuickOutfitGeneratorOutputSchema>;

export async function generateQuickOutfit(input: QuickOutfitGeneratorInput): Promise<QuickOutfitGeneratorOutput> {
  return generateQuickOutfitFlow(input);
}

const prompt = ai.definePrompt({
  name: 'quickOutfitGeneratorPrompt',
  input: { schema: QuickOutfitGeneratorInputSchema },
  output: { schema: QuickOutfitGeneratorOutputSchema },
  model: GEMINI_MODEL,
  prompt: `You are an expert personal stylist. Your task is to create 1-2 complete and stylish outfits from the user's existing closet items, acting as a "What to Wear" feature.

Your suggestions must be tailored to the user's context:
- Occasion: {{{occasion}}}
- Weather: {{{weather}}}
- Mood: {{{mood}}}

The user's closet contains:
{{#each closetItems}}
- Name: {{name}}, Category: {{category}}, Description: {{description}}
{{/each}}


**Instructions:**
1.  **Analyze the Context**: Carefully consider the occasion (e.g., a formal meeting requires different attire than a casual weekend), the weather (e.g., suggest a jacket for cold weather), and the mood.
2.  **Create Outfits**: Suggest 1-2 complete outfits using ONLY the items from the provided closet list.
3.  **Provide Variety**: Do not suggest the same outfit combinations repeatedly. Prioritize variety and creativity.
4.  **Format Output**: For each outfit, provide a creative and descriptive 'title', a brief 'description' explaining why it's a good choice for the context, a list of the exact item names used in the 'items' array, and a 'reasoning' array containing 2-3 short, helpful bullet points explaining why it was chosen (e.g., matches the weather perfectly, great for the given occasion).
5.  **No External Items**: Do not suggest items that are not in the closet.
`
});

const generateQuickOutfitFlow = ai.defineFlow(
  {
    name: 'generateQuickOutfitFlow',
    inputSchema: QuickOutfitGeneratorInputSchema,
    outputSchema: QuickOutfitGeneratorOutputSchema,
  },
  async input => {
    if (input.closetItems.length === 0) {
      return { outfits: [] };
    }
    const { output } = await prompt(input);
    return output!;
  }
);
