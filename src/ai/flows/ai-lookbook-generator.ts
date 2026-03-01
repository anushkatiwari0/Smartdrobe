
'use server';
/**
 * @fileOverview Generates a lookbook of outfit combinations from a user's closet.
 *
 * - generateLookbook - A function that returns a set of outfit suggestions.
 * - GenerateLookbookInput - The input type for the generateLookbook function.
 * - GenerateLookbookOutput - The return type for the generateLookbook function.
 */

import { ai, GEMINI_MODEL } from '@/ai/genkit';
import {z} from 'zod';
import type { ClosetItem } from '@/lib/types';


const ClosetItemSchema = z.object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
    description: z.string(),
    imageUrl: z.string(),
    aiHint: z.string(),
});

const GenerateLookbookInputSchema = z.object({
  occasion: z.string().describe('The occasion for which to generate outfits (e.g., "Casual Weekend", "Business Meeting").'),
  closetItems: z.array(ClosetItemSchema).describe('A list of clothing items available in the user\'s closet.'),
});
export type GenerateLookbookInput = z.infer<typeof GenerateLookbookInputSchema>;

const GenerateLookbookOutputSchema = z.object({
  outfits: z.array(
    z.object({
      title: z.string().describe('A creative, catchy title for the outfit suggestion (e.g., "Monochromatic Mood," "Effortless Elegance").'),
      description: z.string().describe('A brief explanation of why this outfit works for the given occasion and what makes it stylish.'),
      itemNames: z.array(z.string()).describe('An array of the exact item names from the closet that make up the outfit.'),
    })
  ).max(3).describe('An array of 2-3 complete outfit suggestions.'),
});
export type GenerateLookbookOutput = z.infer<typeof GenerateLookbookOutputSchema>;


export async function generateLookbook(input: GenerateLookbookInput): Promise<GenerateLookbookOutput> {
  return generateLookbookFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLookbookPrompt',
  input: {schema: GenerateLookbookInputSchema},
  output: {schema: GenerateLookbookOutputSchema},
  model: GEMINI_MODEL,
  prompt: `You are a professional fashion stylist creating a lookbook of 2-3 outfits for a client based on their existing wardrobe and a specific occasion.

Client's Wardrobe:
{{#each closetItems}}
- {{name}} (Category: {{category}}, Description: {{description}})
{{/each}}

Occasion: {{{occasion}}}

**Instructions:**
1.  **Create Outfits**: Design 2-3 distinct, complete, and stylish outfits using ONLY the items from the provided wardrobe.
2.  **Be Creative**: Combine items in interesting ways. Mix and match categories (e.g., tops, bottoms, outerwear, shoes).
3.  **Title Each Look**: Give each outfit a creative and descriptive title.
4.  **Explain the Style**: For each look, write a short description explaining why the combination is a great choice for the specified occasion.
5.  **List Items Used**: Return the exact names of the items used for each outfit in the 'itemNames' array.
`
});

const generateLookbookFlow = ai.defineFlow(
  {
    name: 'generateLookbookFlow',
    inputSchema: GenerateLookbookInputSchema,
    outputSchema: GenerateLookbookOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);


// Helper function to generate an image from a prompt.
// This is now a placeholder to avoid billing errors.
export async function generateOutfitImage(outfitDescription: string): Promise<{ imageUrl: string }> {
    const seed = outfitDescription.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const imageUrl = `https://picsum.photos/seed/${seed}/600/800`;
    return { imageUrl };
}
