import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const apiKey =
  process.env.GEMINI_API_KEY ||
  process.env.GOOGLE_API_KEY;

/** Gemini model (Google AI API). */
export const GEMINI_MODEL = 'googleai/gemini-2.5-flash';

export const ai = genkit({
  plugins: apiKey ? [googleAI({ apiKey })] : [],
});
