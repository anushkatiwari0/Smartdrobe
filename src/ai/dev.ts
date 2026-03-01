
import { config } from 'dotenv';
// Load environment variables from .env.local, which is where the README instructs users to put them.
config({ path: '.env.local' });
config();

import '@/ai/flows/daily-style-tip.ts';
import '@/ai/flows/ai-outfit-planner.ts';
import '@/ai/flows/closet-item-generator.ts';
import '@/ai/flows/carbon-footprint-calculator.ts';
import '@/ai/flows/scheduled-outfit-generator.ts';
import '@/ai/flows/quick-outfit-generator.ts';
import '@/ai/flows/style-profile-analyzer.ts';
import '@/ai/flows/shopping-assistant.ts';
import '@/ai/flows/make-offer.ts';
import '@/ai/flows/outfit-comparison.ts';
import '@/ai/flows/travel-capsule-generator.ts';
import '@/ai/flows/fit-advisor.ts';
import '@/ai/flows/analyze-photo-post.ts';
import '@/ai/flows/style-coach.ts';
import '@/ai/flows/analyze-closet-item.ts';
import '@/ai/flows/explain-verdict.ts';
import '@/ai/flows/generate-verdict-card.ts';
import '@/ai/flows/ai-lookbook-generator.ts';
import '@/ai/flows/moodboard-generator.ts';
