
'use server';

/**
 * @fileOverview Flow for generating an image of a user's outfit description.
 *
 * - generateOutfitImage - Generates an image based on the outfit description.
 * - GenerateOutfitImageInput - Input type for the generateOutfitImage function.
 * - GenerateOutfitImageOutput - Output type for the generateOutfitImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateOutfitImageInputSchema = z.object({
  outfitDescription: z
    .string()
    .describe('A detailed description of the outfit to generate an image for.'),
});
export type GenerateOutfitImageInput = z.infer<typeof GenerateOutfitImageInputSchema>;

const GenerateOutfitImageOutputSchema = z.object({
  imageUrl: z
    .string()
    .describe(
      'The generated image URL of the outfit, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' /* The generated image data URI. */
    ),
});
export type GenerateOutfitImageOutput = z.infer<typeof GenerateOutfitImageOutputSchema>;

export async function generateOutfitImage(
  input: GenerateOutfitImageInput
): Promise<GenerateOutfitImageOutput> {
  return generateOutfitImageFlow(input);
}

const generateOutfitImageFlow = ai.defineFlow(
  {
    name: 'generateOutfitImageFlow',
    inputSchema: GenerateOutfitImageInputSchema,
    outputSchema: GenerateOutfitImageOutputSchema,
  },
  async input => {
    // Replaced AI image generation with a placeholder to avoid billing errors.
    const seed = input.outfitDescription.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const imageUrl = `https://picsum.photos/seed/${seed}/600/800`;
    return {imageUrl: imageUrl};
  }
);
