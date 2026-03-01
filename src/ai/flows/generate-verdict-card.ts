
'use server';
/**
 * @fileOverview An AI flow to generate a shareable image card for an outfit comparison.
 *
 * - generateVerdictCard - A function that returns an image URL.
 * - GenerateVerdictCardInput - The input type for the function.
 * - GenerateVerdictCardOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { GenerateVerdictCardInputSchema, GenerateVerdictCardOutputSchema } from '@/lib/types';
import type { GenerateVerdictCardInput, GenerateVerdictCardOutput } from '@/lib/types';


export async function generateVerdictCard(input: GenerateVerdictCardInput): Promise<GenerateVerdictCardOutput> {
    return generateVerdictCardFlow(input);
}


const generateVerdictCardFlow = ai.defineFlow(
  {
    name: 'generateVerdictCardFlow',
    inputSchema: GenerateVerdictCardInputSchema,
    outputSchema: GenerateVerdictCardOutputSchema,
  },
  async (input) => {
    // Replaced AI image collage generation with a placeholder to avoid billing errors.
    const seed = input.verdict.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const imageUrl = `https://picsum.photos/seed/${seed}/600/900`;

    return { shareableImageUrl: imageUrl };
  }
);
