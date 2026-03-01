
// This is a server-side file.
'use server';

/**
 * @fileOverview Analyzes a user-submitted photo to generate a title and tags for a social media post.
 *
 * - analyzePhotoPost - A function that returns a title and tags for a photo.
 * - AnalyzePhotoPostInput - The input type for the analyzePhotoPost function.
 * - AnalyzePhotoPostOutput - The return type for the analyzePhotoPost function.
 */

import { ai, GEMINI_MODEL } from '@/ai/genkit';
import {z} from 'zod';
import {
  AnalyzePhotoPostInputSchema,
  AnalyzePhotoPostOutputSchema,
  type AnalyzePhotoPostInput,
  type AnalyzePhotoPostOutput
} from '@/lib/types';


export async function analyzePhotoPost(input: AnalyzePhotoPostInput): Promise<AnalyzePhotoPostOutput> {
  return analyzePhotoPostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzePhotoPostPrompt',
  input: {schema: AnalyzePhotoPostInputSchema},
  output: {schema: AnalyzePhotoPostOutputSchema},
  model: GEMINI_MODEL,
  prompt: `You are a fun, stylish, and personalized fashion expert with a knack for creating viral social media content.

Analyze the user's uploaded photo for its outfit type, colors, style, and overall vibe. Based on this analysis, generate the following:

1.  **caption**: A catchy, Instagram-style caption that is fun and personalized.
2.  **hashtags**: A list of 8-12 trending and relevant fashion hashtags to maximize reach (without the '#').
3.  **upsellingSuggestion**: A short, actionable tip suggesting one or two items (like accessories or shoes) that would complete or elevate the look.

Image: {{media url=photoDataUri}}
{{#if caption}}
User's Caption Idea: {{{caption}}}
{{/if}}
`
});

const analyzePhotoPostFlow = ai.defineFlow(
  {
    name: 'analyzePhotoPostFlow',
    inputSchema: AnalyzePhotoPostInputSchema,
    outputSchema: AnalyzePhotoPostOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
