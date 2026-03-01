
'use server';
/**
 * @fileOverview An AI flow to categorize an uploaded image and generate a caption for it.
 *
 * - categorizeAndCaptionPin - A function that returns a category and caption.
 * - CategorizeAndCaptionPinInput - The input type for the function.
 * - CategorizeAndCaptionPinOutput - The return type for the function.
 */

import { ai, GEMINI_MODEL } from '@/ai/genkit';
import { z } from 'zod';
import { CategorizeAndCaptionPinInputSchema, CategorizeAndCaptionPinOutputSchema } from '@/lib/types';
import type { CategorizeAndCaptionPinInput, CategorizeAndCaptionPinOutput } from '@/lib/types';


export async function categorizeAndCaptionPin(input: CategorizeAndCaptionPinInput): Promise<CategorizeAndCaptionPinOutput> {
    return categorizeAndCaptionPinFlow(input);
}

const prompt = ai.definePrompt({
    name: 'categorizeAndCaptionPinPrompt',
    input: { schema: CategorizeAndCaptionPinInputSchema },
    output: { schema: CategorizeAndCaptionPinOutputSchema },
    model: GEMINI_MODEL,
    prompt: `You are a fashion expert with a great sense of style. Analyze the uploaded image.

Your task is to:
1.  **Categorize**: Assign the most fitting category from this list: 'Streetwear', 'Y2K', 'Cottagecore', 'Minimalist', 'Formal', 'Vintage', 'Other'.
2.  **Caption**: Write a short, trendy, Instagram-style caption that perfectly describes the vibe of the image.

Image: {{media url=photoDataUri}}
`
});


const categorizeAndCaptionPinFlow = ai.defineFlow(
    {
        name: 'categorizeAndCaptionPinFlow',
        inputSchema: CategorizeAndCaptionPinInputSchema,
        outputSchema: CategorizeAndCaptionPinOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        if (!output) {
            throw new Error("Failed to generate a category and caption.");
        }
        return output;
    }
);
