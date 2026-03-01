
// This is a server-side file.
'use server';

/**
 * @fileOverview Calculates the estimated carbon footprint of a clothing item.
 *
 * - calculateCarbonFootprint - A function that returns the carbon footprint analysis.
 * - CarbonFootprintInput - The input type for the calculateCarbonFootprint function.
 * - CarbonFootprintOutput - The return type for the calculateCarbonFootprint function.
 */

import { ai, GEMINI_MODEL } from '@/ai/genkit';
import {z} from 'genkit';

const CarbonFootprintInputSchema = z.object({
  material: z.string().describe('The primary material of the clothing item (e.g., Cotton, Polyester, Wool).'),
  origin: z.string().describe('The country or region where the item was made (e.g., China, Vietnam, USA).'),
  category: z.string().describe('The type of clothing item (e.g., T-Shirt, Jeans, Jacket).'),
});
export type CarbonFootprintInput = z.infer<typeof CarbonFootprintInputSchema>;

const CarbonFootprintOutputSchema = z.object({
  carbonScore: z.number().describe('An estimated carbon footprint score in kg of CO2e. Lower is better.'),
  ecoGrade: z.string().describe('A letter grade from "A+" (best) to "F" (worst) based on the carbon score.'),
  explanation: z.string().describe('A brief explanation of why the item received this score, considering its material, origin, and item category. This should also act as the description for the grade.'),
  suggestion: z.string().describe('A suggestion for a more sustainable alternative or care tip to reduce impact.')
});
export type CarbonFootprintOutput = z.infer<typeof CarbonFootprintOutputSchema>;

export async function calculateCarbonFootprint(input: CarbonFootprintInput): Promise<CarbonFootprintOutput> {
  return calculateCarbonFootprintFlow(input);
}

const prompt = ai.definePrompt({
  name: 'carbonFootprintPrompt',
  input: {schema: CarbonFootprintInputSchema},
  output: {schema: CarbonFootprintOutputSchema},
  model: GEMINI_MODEL,
  prompt: `You are a sustainability expert in the fashion industry. Based on the following clothing item details, provide a carbon footprint analysis.

Item Details:
- Category: {{{category}}}
- Material: {{{material}}}
- Made in: {{{origin}}}

1.  **Calculate carbonScore**: Estimate a carbon footprint score in kilograms of CO2e. A typical cotton t-shirt has a footprint of 7-10 kg. A pair of denim jeans, 25-35 kg. A polyester jacket could be 40+ kg. Base your estimation on the material's production impact (e.g., polyester is fossil-fuel based, leather is very high, organic cotton is lower) and typical shipping distances from the origin country.
2.  **Determine ecoGrade**: Assign a letter grade based on the score. Use this scale: <10 is A+, <20 is A-, <30 is B+, <40 is B-, <50 is C+, >50 is C- or lower.
3.  **Write explanation**: Provide a concise explanation for the score and grade. This text will be displayed to the user as the primary feedback.
4.  **Give suggestion**: Offer a practical, sustainable alternative or a care tip.
`
});

const calculateCarbonFootprintFlow = ai.defineFlow(
  {
    name: 'calculateCarbonFootprintFlow',
    inputSchema: CarbonFootprintInputSchema,
    outputSchema: CarbonFootprintOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
