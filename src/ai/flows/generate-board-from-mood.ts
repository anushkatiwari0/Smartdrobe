
'use server';
/**
 * @fileOverview An AI flow to generate a moodboard with 6 pins from a user's mood.
 *
 * - generateBoardFromMood - A function that returns a board name and 6 pins.
 * - GenerateBoardFromMoodInput - The input type for the function.
 * - GenerateBoardFromMoodOutput - The return type for the function.
 */

import { ai, GEMINI_MODEL } from '@/ai/genkit';
import { GenerateBoardFromMoodInputSchema, GenerateBoardFromMoodOutputSchema } from '@/lib/types';
import type { GenerateBoardFromMoodInput, GenerateBoardFromMoodOutput } from '@/lib/types';


export async function generateBoardFromMood(input: GenerateBoardFromMoodInput): Promise<GenerateBoardFromMoodOutput> {
    return generateBoardFromMoodFlow(input);
}


// Step 1: Define a prompt to generate the board name and image prompts from the mood
const planningPrompt = ai.definePrompt({
    name: 'moodboardPlanningPrompt',
    input: { schema: GenerateBoardFromMoodInputSchema },
    output: { schema: GenerateBoardFromMoodOutputSchema.pick({ boardName: true, pins: true }) },
    model: GEMINI_MODEL,
    prompt: `You are a creative art director and fashion expert. A user has provided a mood or theme.
Your task is to generate a creative name for a moodboard and then create prompts for 6 distinct, visually cohesive images that fit this mood.

User's Mood: "{{mood}}"

1.  **Board Name**: Create a catchy, creative name for the moodboard.
2.  **Pin Prompts**: Generate 6 detailed image prompts for an AI image generator. Each prompt should describe a single, visually interesting image that fits the overall aesthetic. The prompts should be varied (e.g., include flat lays, full outfits, textures, accessories, locations) but thematically connected.

Example for mood "coastal grandmother":
- Board Name: "Seaside Serenity"
- Pins:
  1. A close-up shot of a white linen shirt draped over a weathered wooden chair on a sandy porch.
  2. A flat lay of a straw hat, a classic novel, and a pair of sunglasses on a blue and white striped beach towel.
  3. A woman from behind, wearing a cream-colored chunky knit sweater, looking out at a misty ocean.
  4. A detailed photograph of a collection of seashells and smooth gray stones.
  5. A crisp, minimalist photo of a pair of beige leather sandals next to a woven market bag.
  6. A serene shot of a light blue bicycle with a basket of fresh flowers parked against a white picket fence.
`
});


// Helper to generate a single image and return its URL.
// This now uses a placeholder to avoid billing errors.
async function generateImage(prompt: string): Promise<string> {
    const seed = prompt.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `https://picsum.photos/seed/${seed}/600/800`;
}


// The main flow that orchestrates planning and image generation.
const generateBoardFromMoodFlow = ai.defineFlow(
  {
    name: 'generateBoardFromMoodFlow',
    inputSchema: GenerateBoardFromMoodInputSchema,
    outputSchema: GenerateBoardFromMoodOutputSchema,
  },
  async (input) => {
    
    // 1. Get the plan (board name and image prompts) from the planning prompt.
    const { output: plan } = await planningPrompt(input);
    if (!plan) {
        throw new Error("Failed to generate a plan for the moodboard.");
    }

    // 2. Generate all 6 images in parallel.
    const imagePromises = plan.pins.map(pin => generateImage(pin.imagePrompt));
    const imageUrls = await Promise.all(imagePromises);

    // 3. Combine the plan and the generated image URLs into the final output.
    const finalPins = plan.pins.map((pin, index) => ({
        ...pin,
        imageUrl: imageUrls[index],
    }));

    return {
        boardName: plan.boardName,
        pins: finalPins,
    };
  }
);
