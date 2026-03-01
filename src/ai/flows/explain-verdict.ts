
'use server';
/**
 * @fileOverview An AI flow to explain the reasoning behind an outfit comparison verdict.
 *
 * - explainVerdict - A function that returns a simple explanation.
 * - ExplainVerdictInput - The input type for the function.
 * - ExplainVerdictOutput - The return type for the function.
 */

import { ai, GEMINI_MODEL } from '@/ai/genkit';
import { z } from 'zod';
import { ExplainVerdictInputSchema, ExplainVerdictOutputSchema } from '@/lib/types';
import type { ExplainVerdictInput, ExplainVerdictOutput } from '@/lib/types';


export async function explainVerdict(input: ExplainVerdictInput): Promise<ExplainVerdictOutput> {
    return explainVerdictFlow(input);
}

const prompt = ai.definePrompt({
    name: 'explainVerdictPrompt',
    input: { schema: ExplainVerdictInputSchema },
    output: { schema: ExplainVerdictOutputSchema },
    model: GEMINI_MODEL,
    prompt: `You are an AI Fashion Coach. A user wants to understand why you chose one outfit over another.
Your previous verdict was: "{{verdict}}"
Your improvement tips for Outfit A were: "{{tipsA}}"
Your improvement tips for Outfit B were: "{{tipsB}}"

Based on this information, provide a simple, conversational, and encouraging explanation for your choice. Speak directly to the user. Do not just repeat the verdict. Explain the 'why' in 1-2 friendly sentences.

Example: "I chose Outfit B because its relaxed fit and lighter colors are a much better match for a casual brunch. While Outfit A is stylish, it feels a bit too formal for that occasion."
`,
});


const explainVerdictFlow = ai.defineFlow(
    {
        name: 'explainVerdictFlow',
        inputSchema: ExplainVerdictInputSchema,
        outputSchema: ExplainVerdictOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        if (!output) {
            throw new Error("Failed to generate an explanation.");
        }
        return output;
    }
);
