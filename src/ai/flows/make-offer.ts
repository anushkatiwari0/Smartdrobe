
// This is a server-side file.
'use server';

/**
 * @fileOverview A flow to handle making an offer on a second-hand item.
 *
 * - makeOffer - A function that simulates making an offer.
 * - MakeOfferInput - The input type for the makeOffer function.
 * - MakeOfferOutput - The return type for the makeOffer function.
 */

import { ai, GEMINI_MODEL } from '@/ai/genkit';
import { MakeOfferInputSchema, MakeOfferOutputSchema, type MakeOfferInput, type MakeOfferOutput } from '@/lib/types';
import {z} from 'zod';

export async function makeOffer(input: MakeOfferInput): Promise<MakeOfferOutput> {
  return makeOfferFlow(input);
}

const prompt = ai.definePrompt({
  name: 'makeOfferPrompt',
  input: {schema: MakeOfferInputSchema},
  output: {schema: MakeOfferOutputSchema},
  model: GEMINI_MODEL,
  prompt: `You are a helpful assistant in a second-hand marketplace app. A user is making an offer on an item.

Item Name: {{{itemName}}}
User's Message: {{{offerMessage}}}

Generate a brief, friendly, and encouraging confirmation message for the user. Confirm that their offer has been sent to the seller. For example: "Your offer on the {{itemName}} has been sent! The seller will be notified." or "Success! Your message has been sent to the seller of the {{itemName}}."
`
});

const makeOfferFlow = ai.defineFlow(
  {
    name: 'makeOfferFlow',
    inputSchema: MakeOfferInputSchema,
    outputSchema: MakeOfferOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
