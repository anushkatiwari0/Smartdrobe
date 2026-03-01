
// This is a server-side file.
'use server';

/**
 * @fileOverview Generates a travel capsule wardrobe and packing list.
 *
 * - generateTravelCapsule - A function that returns a packing list and daily outfit plan.
 * - TravelCapsuleInput - The input type for the function.
 * - TravelCapsuleOutput - The return type for the function.
 */

import { ai, GEMINI_MODEL } from '@/ai/genkit';
import { z } from 'zod';
import {
  TravelCapsuleInputSchema,
  TravelCapsuleOutputSchema,
  type TravelCapsuleInput,
  type TravelCapsuleOutput,
} from '@/lib/types';

export async function generateTravelCapsule(
  input: TravelCapsuleInput
): Promise<TravelCapsuleOutput> {
  return generateTravelCapsuleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'travelCapsulePrompt',
  input: { schema: TravelCapsuleInputSchema },
  output: { schema: TravelCapsuleOutputSchema },
  model: GEMINI_MODEL,
  prompt: `You are an expert travel stylist creating a capsule wardrobe for a trip.

The user's closet contains:
{{#each closetItems}}
- {{name}} (ID: {{id}}, Category: {{category}})
{{/each}}

Trip Details:
- Destination: {{{destination}}}
- Duration: {{{duration}}} days

Based on the destination, infer the likely weather conditions. Your task is to create a minimal and versatile packing list that maximizes outfit combinations.

1.  **Create Packing List**: Select the minimum number of items from the user's closet to pack. Return an array of the item **IDs** for the 'packingList' field.
2.  **Create Daily Outfit Plan**: For each day of the trip, suggest a complete outfit using ONLY the items from your generated packing list. Each daily plan should have a title (e.g., "Day 1: Exploring the City"), a description of the outfit, and an array of the item **IDs** used in that outfit.

Return the final plan in the specified JSON format.
`,
});

const generateTravelCapsuleFlow = ai.defineFlow(
  {
    name: 'generateTravelCapsuleFlow',
    inputSchema: TravelCapsuleInputSchema,
    outputSchema: TravelCapsuleOutputSchema,
  },
  async (input) => {
    if (input.closetItems.length < 5) {
      throw new Error(
        'Please add at least 5 items to your closet for travel planning.'
      );
    }
    const { output } = await prompt(input);
    return output!;
  }
);
