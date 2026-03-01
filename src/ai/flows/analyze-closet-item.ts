
'use server';
/**
 * @fileOverview Analyzes a user-submitted clothing item photo to generate details for their virtual closet.
 *
 * - analyzeClosetItem - A function that returns a name, category, description, and colors for a clothing item from a photo.
 * - AnalyzeClosetItemInput - The input type for the analyzeClosetItem function.
 * - AnalyzeClosetItemOutput - The return type for the analyzeClosetItem function.
 */

import { ai, GEMINI_MODEL } from '@/ai/genkit';
import {z} from 'zod';

const AnalyzeClosetItemInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a single clothing item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeClosetItemInput = z.infer<typeof AnalyzeClosetItemInputSchema>;

const AnalyzeClosetItemOutputSchema = z.object({
  itemName: z
    .string()
    .describe(
      'A concise, descriptive name for the clothing item (e.g., "Blue Denim Jacket", "Floral Summer Dress").'
    ),
  category: z
    .enum([
      'Tops',
      'Bottoms',
      'Dresses',
      'Outerwear',
      'Shoes',
      'Accessories',
      'Bags',
      'Jewelry',
      'Other',
    ])
    .describe('The best-fitting category for the clothing item.'),
  description: z
    .string()
    .describe(
      'A detailed, objective description of the item, including its style, and any notable features (e.g., "A long-sleeved, crewneck sweater made of a chunky wool knit.").'
    ),
  detectedColors: z.array(z.string()).describe("An array of 4-5 dominant hex color codes in the item (e.g., ['#4F46E5', '#FFFFFF'])."),
  dominantColorHex: z.string().describe("The hex code for the most dominant color in the item (e.g., '#4F46E5')."),
  styleTags: z.array(z.string()).describe("An array of 3-5 descriptive tags for the item's style, occasion, and season (e.g., 'Casual', 'Summer', 'Minimalist', 'Streetwear')."),
});
export type AnalyzeClosetItemOutput = z.infer<typeof AnalyzeClosetItemOutputSchema>;

export async function analyzeClosetItem(input: AnalyzeClosetItemInput): Promise<AnalyzeClosetItemOutput> {
  return analyzeClosetItemFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeClosetItemPrompt',
  input: {schema: AnalyzeClosetItemInputSchema},
  output: {schema: AnalyzeClosetItemOutputSchema},
  model: GEMINI_MODEL,
  prompt: `You are a fashion expert and color theorist with a keen eye for detail. Analyze the following image.

Your task is to:
1.  **Categorize the Item**: Classify the item into one of the following categories: 'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories', 'Bags', 'Jewelry', or 'Other'.
2.  **Name the Item**: Create a short, descriptive name for the item.
3.  **Describe the Item**: Provide a detailed, objective description of the item. Mention its style, fabric, and any distinctive patterns or features.
4.  **Identify Colors**: Detect a palette of 4-5 dominant colors in the item. Return these as an array of hex color codes for 'detectedColors'.
5.  **Primary Hex Code**: Provide the hex code for the single most dominant color for 'dominantColorHex'.
6.  **Generate Style Tags**: Provide 3-5 relevant, searchable style tags. Include tags for style (e.g., 'Minimalist', 'Bohemian'), occasion (e.g., 'Workwear', 'Date Night'), and season (e.g., 'Summer', 'Winter').

Image: {{media url=photoDataUri}}
`,
});

const analyzeClosetItemFlow = ai.defineFlow(
  {
    name: 'analyzeClosetItemFlow',
    inputSchema: AnalyzeClosetItemInputSchema,
    outputSchema: AnalyzeClosetItemOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
