
// This is a server-side file.
'use server';

/**
 * @fileOverview Flow for generating an image of a single clothing item.
 *
 * - generateClosetItemImage - Generates an image based on the item description.
 * - GenerateClosetItemImageInput - Input type for the generateClosetItemImage function.
 * - GenerateClosetItemImageOutput - Output type for the generateClosetItemImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateClosetItemImageInputSchema = z.object({
  itemDescription: z
    .string()
    .describe('A detailed description of a single clothing item to generate an image for.'),
});
export type GenerateClosetItemImageInput = z.infer<typeof GenerateClosetItemImageInputSchema>;

const GenerateClosetItemImageOutputSchema = z.object({
  imageUrl: z
    .string()
    .describe(
      "The generated image URL of the outfit, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateClosetItemImageOutput = z.infer<typeof GenerateClosetItemImageOutputSchema>;

export async function generateClosetItemImage(
  input: GenerateClosetItemImageInput
): Promise<GenerateClosetItemImageOutput> {
  return generateClosetItemImageFlow(input);
}

const generateClosetItemImageFlow = ai.defineFlow(
  {
    name: 'generateClosetItemImageFlow',
    inputSchema: GenerateClosetItemImageInputSchema,
    outputSchema: GenerateClosetItemImageOutputSchema,
  },
  async input => {
    // Replaced AI image generation with a placeholder to avoid billing errors.
    const seed = input.itemDescription.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const imageUrl = `https://picsum.photos/seed/${seed}/600/600`;
    return {imageUrl: imageUrl};
  }
);
