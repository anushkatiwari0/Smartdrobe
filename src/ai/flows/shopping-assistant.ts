
// This is a server-side file.
'use server';

/**
 * @fileOverview A smart shopping assistant that suggests new items to complement an existing wardrobe.
 *
 * - generateShoppingSuggestions - A function that returns shopping suggestions.
 */

import { ai, GEMINI_MODEL } from '@/ai/genkit';
import {z} from 'zod';
import { ShoppingSuggestionsInputSchema, ShoppingSuggestionsOutputSchema, type ShoppingSuggestionsInput, type ShoppingSuggestionsOutput } from '@/lib/types';

const findShoppingItem = ai.defineTool(
  {
    name: 'findShoppingItem',
    description: 'Finds a specific clothing item from an online store and returns its details.',
    inputSchema: z.object({
      query: z.string().describe('The search query for the clothing item (e.g., "blue denim jacket").'),
    }),
    outputSchema: z.object({
        name: z.string().describe("The name of the item found."),
        price: z.number().describe("The price of the item."),
        url: z.string().url().describe("The URL to the product page."),
    }),
  },
  async (input) => {
    // This is a mock function. In a real application, this would call
    // an e-commerce API (e.g., Myntra, Ajio) to find the item.
    const price = parseFloat((Math.random() * (8000 - 1000) + 1000).toFixed(2));
    const urlSafeQuery = encodeURIComponent(input.query);
    return {
      name: input.query,
      price: price,
      url: `https://www.myntra.com/${urlSafeQuery}`,
    };
  }
);


export async function generateShoppingSuggestions(input: ShoppingSuggestionsInput): Promise<ShoppingSuggestionsOutput> {
  return shoppingAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'shoppingAssistantPrompt',
  input: {schema: ShoppingSuggestionsInputSchema},
  output: {schema: ShoppingSuggestionsOutputSchema},
  model: GEMINI_MODEL,
  tools: [findShoppingItem],
  prompt: `You are an expert personal shopper and fashion stylist. Your task is to analyze a user's wardrobe and suggest 3-4 key new items that would maximize their outfit combinations and elevate their style.

The user's current closet contains:
{{#each closetItems}}
- {{name}} (Category: {{category}})
{{/each}}

Based on this wardrobe, please provide 3-4 specific shopping suggestions. First, identify the most significant style gap (e.g., "lack of versatile outerwear," "need for more formal options"). Then, for each suggestion:
1.  **itemName**: Give a clear and specific name for the item (e.g., "Versatile Navy Blazer," "White Leather Sneakers," "Silk Camisole Top").
2.  **reason**: Briefly explain why this item is a great choice and how it specifically addresses the style gap and complements the existing pieces.
3.  **imagePrompt**: Write a concise, descriptive prompt suitable for an AI image generator to create a high-quality, product-style photograph of the suggested item on a neutral, clean background. For example: "A high-quality studio photograph of a classic navy blue wool-blend blazer on a mannequin."
4.  **Find a real product**: Use the findShoppingItem tool to find a real-world example of the item online. Include the price and URL from the tool's output in your final response for the 'price' and 'url' fields.

Focus on versatile, high-impact pieces that fill a clear need in the wardrobe.
`
});

const shoppingAssistantFlow = ai.defineFlow(
  {
    name: 'shoppingAssistantFlow',
    inputSchema: ShoppingSuggestionsInputSchema,
    outputSchema: ShoppingSuggestionsOutputSchema,
  },
  async input => {
    if (input.closetItems.length < 3) {
        throw new Error("Please add at least 3 items to your closet for shopping suggestions.");
    }
    const {output} = await prompt(input);
    return output!;
  }
);
