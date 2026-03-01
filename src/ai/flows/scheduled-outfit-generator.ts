
// This is a server-side file.
'use server';

/**
 * @fileOverview Generates a scheduled outfit suggestion based on closet items and an event description.
 *
 * - generateScheduledOutfit - A function that generates an outfit suggestion.
 * - ScheduledOutfitGeneratorInput - The input type for the function.
 * - ScheduledOutfitGeneratorOutput - The return type for the function.
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

const ScheduledOutfitGeneratorInputSchema = z.object({
  eventDescription: z.string().describe('A description of the event for which an outfit is needed (e.g., "Important client presentation," "Casual coffee with a friend").'),
  closetItems: z.array(ClosetItemSchema).describe('A list of clothing items available in the user\'s closet.'),
});
export type ScheduledOutfitGeneratorInput = z.infer<typeof ScheduledOutfitGeneratorInputSchema>;

const ScheduledOutfitGeneratorOutputSchema = z.object({
  outfit: z.object({
      title: z.string().describe('A short, catchy title for the suggested outfit.'),
      description: z.string().describe('A brief explanation of why this outfit works for the event.'),
      itemIds: z.array(z.string()).describe('An array of item IDs from the closet that make up the outfit.'),
    }).describe('A complete outfit suggestion for the event.')
});
export type ScheduledOutfitGeneratorOutput = z.infer<typeof ScheduledOutfitGeneratorOutputSchema>;

export async function generateScheduledOutfit(input: ScheduledOutfitGeneratorInput): Promise<ScheduledOutfitGeneratorOutput> {
  return generateScheduledOutfitFlow(input);
}

const prompt = ai.definePrompt({
  name: 'scheduledOutfitGeneratorPrompt',
  input: {schema: ScheduledOutfitGeneratorInputSchema},
  output: {schema: ScheduledOutfitGeneratorOutputSchema},
  model: GEMINI_MODEL,
  prompt: `You are a personal stylist planning an outfit from a user's closet for a specific event.

The user's closet contains the following items:
{{#each closetItems}}
- {{name}} (ID: {{id}}, Category: {{category}})
{{/each}}

The user needs an outfit for the following event:
- Event Description: {{{eventDescription}}}

Please suggest a single, complete outfit using ONLY the items from the closet list above. Provide a title for the outfit, a brief explanation of why it's a good choice for the event, and list the IDs of the items used. Ensure the chosen items are appropriate for the event described. Do not use items not present in the closet.
`
});

const generateScheduledOutfitFlow = ai.defineFlow(
  {
    name: 'generateScheduledOutfitFlow',
    inputSchema: ScheduledOutfitGeneratorInputSchema,
    outputSchema: ScheduledOutfitGeneratorOutputSchema,
  },
  async input => {
    if (input.closetItems.length === 0) {
        throw new Error("Cannot generate outfit from an empty closet.");
    }
    const {output} = await prompt(input);
    return output!;
  }
);
