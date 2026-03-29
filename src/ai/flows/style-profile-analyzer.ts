
// This is a server-side file.
'use server';

/**
 * @fileOverview Analyzes a user's closet to determine their style profile.
 *
 * - analyzeStyleProfile - A function that returns a style analysis.
 * - StyleProfileAnalyzerInput - The input type for the function.
 * - StyleProfileAnalyzerOutput - The return type for the function.
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
    aiHint: z.string().optional().default(''),
});

const StyleProfileAnalyzerInputSchema = z.object({
  closetItems: z.array(ClosetItemSchema).describe("A list of all clothing items in the user's closet."),
});
export type StyleProfileAnalyzerInput = z.infer<typeof StyleProfileAnalyzerInputSchema>;

const StyleProfileAnalyzerOutputSchema = z.object({
    dominantStyle: z.string().describe("The user's primary fashion style (e.g., 'Minimalist', 'Bohemian', 'Classic')."),
    styleDescription: z.string().describe("A brief, encouraging paragraph describing the user's style and how they can build on it."),
    colorPalette: z.array(z.string()).describe("An array of 3-5 dominant colors found in the user's wardrobe."),
    categoryDistribution: z.array(z.object({
        name: z.string().describe("The name of the clothing category."),
        count: z.number().describe("The number of items in this category."),
        fill: z.string().describe("A hex color code for chart visualization."),
    })).describe("A breakdown of the wardrobe by clothing category."),
    keyPieces: z.array(z.string()).describe("An array of 2-3 key clothing item suggestions to enhance the user's dominant style."),
    versatilityScore: z.number().min(0).max(100).describe("A score from 0-100 indicating how versatile and mix-and-matchable the wardrobe is."),
    colorDiversity: z.number().min(0).max(100).describe("A score from 0-100 indicating color variety in the wardrobe."),
    wardrobeGaps: z.array(z.string()).describe("An array of 2-3 missing category types or essential items that would complete the wardrobe."),
    styleConfidence: z.number().min(0).max(100).describe("A score from 0-100 indicating how cohesive and well-defined the style is."),
});
export type StyleProfileAnalyzerOutput = z.infer<typeof StyleProfileAnalyzerOutputSchema>;

export async function analyzeStyleProfile(input: StyleProfileAnalyzerInput): Promise<StyleProfileAnalyzerOutput> {
  return styleProfileAnalyzerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'styleProfileAnalyzerPrompt',
  input: {schema: StyleProfileAnalyzerInputSchema},
  output: {schema: StyleProfileAnalyzerOutputSchema},
  model: GEMINI_MODEL,
  prompt: `You are an expert fashion stylist and data analyst. Your task is to analyze a user's wardrobe and provide a comprehensive style profile.

The user's closet contains the following items:
{{#each closetItems}}
- {{name}} (Category: {{category}}, Description: {{description}})
{{/each}}

Based on this list, please perform the following analysis:

1.  **Identify the Dominant Style**: Determine the user's primary style (e.g., "Classic," "Minimalist," "Streetwear," "Bohemian," "Eclectic").
2.  **Write a Style Description**: Provide a brief, positive, and encouraging description of their style. It should feel personal and insightful.
3.  **Determine the Color Palette**: Identify the 3 to 5 most prominent colors in their wardrobe.
4.  **Calculate Category Distribution**: Count the number of items in each category. For the output, create a list of objects, each with a 'name', 'count', and a unique 'fill' color. Use appealing **pastel** hex codes like '#a2d2ff', '#bde0fe', '#ffafcc', '#ffc8dd', '#cdb4db'.
5.  **Suggest Key Pieces**: Based on the dominant style, suggest 2-3 key clothing or accessory items that would elevate their wardrobe.
6.  **Calculate Versatility Score** (0-100): Rate how well items can be mixed and matched. Higher scores mean more outfit combinations possible.
7.  **Calculate Color Diversity** (0-100): Measure the variety of colors. Balance is good - not too monotone, not too chaotic.
8.  **Identify Wardrobe Gaps**: List 2-3 missing essential categories or items (e.g., "Formal shoes", "Light jacket", "Accessories").
9.  **Calculate Style Confidence** (0-100): How cohesive and well-defined is the style? Higher means clearer identity.

Return the final analysis in the specified JSON format.
`
});

const styleProfileAnalyzerFlow = ai.defineFlow(
  {
    name: 'styleProfileAnalyzerFlow',
    inputSchema: StyleProfileAnalyzerInputSchema,
    outputSchema: StyleProfileAnalyzerOutputSchema,
  },
  async input => {
    if (input.closetItems.length < 3) {
        throw new Error("Insufficient items for analysis. Please add at least 3 items to your closet.");
    }
    const normalizedInput = {
      closetItems: input.closetItems.map((item) => ({
        id: item.id,
        name: item.name ?? '',
        category: item.category ?? '',
        description: item.description ?? '',
        imageUrl: item.imageUrl ?? '',
        aiHint: item.aiHint ?? '',
      })),
    };

    let output;
    try {
      const result = await prompt(normalizedInput);
      output = result.output;
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e));
      throw new Error(
        err.message?.includes('API key') || err.message?.includes('GEMINI')
          ? 'AI service is not configured. Please add GEMINI_API_KEY to .env.local.'
          : `Style analysis failed: ${err.message}`
      );
    }

    if (!output) {
      throw new Error('The style analysis did not return results. Please try again.');
    }

    // Safeguard: Ensure generated fill colors are valid pastel hex codes.
    const pastelChartColors = ['#a2d2ff', '#bde0fe', '#ffafcc', '#ffc8dd', '#cdb4db', '#fcf6bd', '#d0f4de', '#a9def9'];
    const categoryDistribution = Array.isArray(output.categoryDistribution)
      ? output.categoryDistribution.map((cat: { name?: string; count?: number; fill?: string }, index: number) => {
          const name = typeof cat?.name === 'string' ? cat.name : `Category ${index + 1}`;
          const count = typeof cat?.count === 'number' ? cat.count : 0;
          const fill = /^#[0-9A-F]{6}$/i.test(cat?.fill ?? '') ? cat.fill! : pastelChartColors[index % pastelChartColors.length];
          return { name, count, fill };
        })
      : [];

    // Ensure colorPalette is string[] and keyPieces is string[]
    const colorPalette = Array.isArray(output.colorPalette)
      ? output.colorPalette.map((c: unknown) => (typeof c === 'string' ? c : (c as { name?: string })?.name ?? '')).filter(Boolean)
      : [];
    const keyPieces = Array.isArray(output.keyPieces)
      ? output.keyPieces.map((k: unknown) => (typeof k === 'string' ? k : String(k)))
      : [];
    const wardrobeGaps = Array.isArray(output.wardrobeGaps)
      ? output.wardrobeGaps.map((g: unknown) => (typeof g === 'string' ? g : String(g)))
      : ['Basic accessories', 'Versatile shoes'];

    return {
      dominantStyle: typeof output.dominantStyle === 'string' ? output.dominantStyle : 'Eclectic',
      styleDescription: typeof output.styleDescription === 'string' ? output.styleDescription : 'Your wardrobe shows a mix of styles. Add more items for a clearer profile.',
      colorPalette: colorPalette.length > 0 ? colorPalette : ['Neutral', 'Black', 'White'],
      categoryDistribution,
      keyPieces: keyPieces.length > 0 ? keyPieces : ['A versatile jacket', 'Statement accessories'],
      versatilityScore: typeof output.versatilityScore === 'number' ? output.versatilityScore : 65,
      colorDiversity: typeof output.colorDiversity === 'number' ? output.colorDiversity : 50,
      wardrobeGaps,
      styleConfidence: typeof output.styleConfidence === 'number' ? output.styleConfidence : 70,
    };
  }
);
