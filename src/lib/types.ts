
import { z } from 'zod';

export type ClosetItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  photoDataUri?: string; // Should only contain a data URI for items added one-by-one, NOT for bulk imports
  aiHint: string;
  color?: string; // Manually selected primary color
  colors?: string[]; // AI-detected colors
  primaryColorHex?: string;

  // Metrics Tracking
  wearCount?: number;
  lastWorn?: string; // ISO date string
  aiSuggestionCount?: number;
};

export type UserOutfit = {
  id: string;
  name: string;
  itemIds: string[];

  // Metrics Tracking
  wearCount?: number;
  lastWorn?: string; // ISO date string
  aiGenerated?: boolean;
  aiAccepted?: boolean;
};

export type Comment = {
  id: string;
  username: string;
  text: string;
};

export type PollOption = {
  id: string;
  description: string;
  imageUrl: string;
  aiHint: string;
  votes: number;
};

export type Poll = {
  options: [PollOption, PollOption]; // A poll always has two options
  totalVotes: number;
  userVote?: 'A' | 'B'; // Which option the current user voted for
};

export type FeedPost = {
  id: string;
  type: 'photo' | 'ai-generated' | 'poll' | 'news' | 'social';
  user: {
    name: string;
    avatar: string;
  }
  title?: string;
  description: string;
  mediaUrl?: string;
  originalUrl?: string;
  tags?: string[];
  publishedAt: string;
  likes: number;
  isLiked: boolean;
  comments: Comment[];
  poll?: Poll;
};

export type Purchase = {
  id: string;
  name: string;
  price: number;
  date: string;
  category: string;
}

// Schema for Shopping Assistant
const ClosetItemSchemaForShopping = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  aiHint: z.string(),
});

export const ShoppingSuggestionsInputSchema = z.object({
  closetItems: z.array(ClosetItemSchemaForShopping).describe("A list of all clothing items in the user's closet."),
});
export type ShoppingSuggestionsInput = z.infer<typeof ShoppingSuggestionsInputSchema>;

export const ShoppingSuggestionsOutputSchema = z.object({
  suggestions: z.array(
    z.object({
      itemName: z.string().describe("The name of the suggested clothing item (e.g., 'Classic Trench Coat')."),
      reason: z.string().describe("A brief explanation of why this item would be a good addition to the current wardrobe."),
      imagePrompt: z.string().describe("A detailed description of the item for generating a product-style photograph."),
      price: z.number().optional().describe("An approximate price for the item."),
      url: z.string().optional().describe("A URL to a similar product."),
    })
  ).describe('An array of 3-4 shopping suggestions to complement the existing closet.'),
});
export type ShoppingSuggestionsOutput = z.infer<typeof ShoppingSuggestionsOutputSchema>;


// Schema for Make an Offer
export const MakeOfferInputSchema = z.object({
  itemId: z.string().describe('The unique identifier of the item the offer is for.'),
  itemName: z.string().describe('The name of the item.'),
  offerMessage: z.string().describe("The user's message to the seller."),
});
export type MakeOfferInput = z.infer<typeof MakeOfferInputSchema>;

export const MakeOfferOutputSchema = z.object({
  confirmationMessage: z.string().describe("A confirmation message to show the user after they've sent their offer."),
});
export type MakeOfferOutput = z.infer<typeof MakeOfferOutputSchema>;


// Schema for Outfit Comparison
export const OutfitComparisonInputSchema = z.object({
  occasion: z.string().describe('The occasion the outfits are for (e.g., Casual Brunch, Work Meeting).'),
  outfitADescription: z
    .string()
    .optional()
    .describe('A detailed text description of the first outfit option.'),
  outfitBDescription: z
    .string()

    .optional()
    .describe('A detailed text description of the second outfit option.'),
  outfitADataUri: z
    .string()
    .optional()
    .describe("An image of the first outfit option, as a data URI."),
  outfitBDataUri: z
    .string()
    .optional()
    .describe("An image of the second outfit option, as a data URI."),
});
export type OutfitComparisonInput = z.infer<typeof OutfitComparisonInputSchema>;

export const OutfitComparisonOutputSchema = z.object({
  outfitAImageUrl: z.string().describe('The generated image URL for Outfit A as a data URI.'),
  outfitBImageUrl: z.string().describe('The generated image URL for Outfit B as a data URI.'),
  recommendation: z
    .enum(['A', 'B'])
    .describe('The final recommendation, indicating which outfit is preferred.'),
  verdict: z
    .string()
    .describe("A concise, one-sentence explanation for the final recommendation."),
  outfitAAnalysis: z.object({
    improvementTips: z.array(z.string()).describe("A list of 1-2 actionable tips to improve Outfit A."),
  }),
  outfitBAnalysis: z.object({
    improvementTips: z.array(z.string()).describe("A list of 1-2 actionable tips to improve Outfit B."),
  }),
});
export type OutfitComparisonOutput = z.infer<typeof OutfitComparisonOutputSchema>;

// Schema for Travel Capsule Generator
const ClosetItemSchemaForTravel = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  aiHint: z.string(),
});

export const TravelCapsuleInputSchema = z.object({
  destination: z
    .string()
    .describe('The travel destination (e.g., "Paris, France").'),
  duration: z
    .number()
    .int()
    .positive()
    .describe('The duration of the trip in days.'),
  closetItems: z
    .array(ClosetItemSchemaForTravel)
    .describe("A list of all clothing items in the user's closet."),
});
export type TravelCapsuleInput = z.infer<typeof TravelCapsuleInputSchema>;

export const TravelCapsuleOutputSchema = z.object({
  packingList: z
    .array(z.string())
    .describe("An array of item IDs to pack for the trip."),
  dailyPlan: z
    .array(
      z.object({
        title: z
          .string()
          .describe(
            "A title for the day's plan (e.g., 'Day 1: Arrival & Exploration')."
          ),
        description: z
          .string()
          .describe("A description of the suggested outfit for the day."),
        itemIds: z
          .array(z.string())
          .describe('An array of item IDs from the closet that make up the outfit for the day.'),
      })
    )
    .describe(
      'An array of daily outfit suggestions for the duration of the trip.'
    ),
});
export type TravelCapsuleOutput = z.infer<typeof TravelCapsuleOutputSchema>;

// Schema for Fit Advisor
export const FitAdvisorInputSchema = z.object({
  height: z.string().describe("The user's height."),
  weight: z.string().describe("The user's weight."),
  gender: z.string().describe("The user's gender (e.g., Male, Female, Other)."),
  bodyShape: z
    .string()
    .describe('The body shape that the user identifies with (e.g., Rectangle, Pear, Apple, Hourglass).'),
  fitPreference: z
    .string()
    .describe("The user's preferred clothing fit (e.g., Loose, Tailored)."),
});
export type FitAdvisorInput = z.infer<typeof FitAdvisorInputSchema>;

export const FitAdvisorOutputSchema = z.object({
  dos: z.array(z.string()).describe("A list of 'do' recommendations for fashion choices."),
  donts: z.array(z.string()).describe("A list of 'don't' recommendations for fashion choices."),
  shoppingSuggestions: z.array(z.object({
    itemName: z.string().describe("The name of the suggested item to buy."),
    reason: z.string().describe("Why this item is a good suggestion for the user."),
  })).describe("A list of 2-3 specific items the user could buy to enhance their wardrobe."),
});
export type FitAdvisorOutput = z.infer<typeof FitAdvisorOutputSchema>;


// Schema for Analyze Photo Post
export const AnalyzePhotoPostInputSchema = z.object({
  photoDataUri: z.string().describe("A photo from the user's webcam, as a data URI."),
  caption: z.string().optional().describe("An optional user-provided caption for the photo."),
});
export type AnalyzePhotoPostInput = z.infer<typeof AnalyzePhotoPostInputSchema>;


export const AnalyzePhotoPostOutputSchema = z.object({
  caption: z.string().describe("A catchy and descriptive title for the social media post based on the photo content and caption. E.g., 'Rocking the Vintage Look', 'Sunny Day Vibes'"),
  hashtags: z.array(z.string()).min(8).max(12).describe("An array of 8-12 relevant hashtags for the post (without the '#'). E.g., ['ootd', 'streetstyle', 'vintagefashion']"),
  upsellingSuggestion: z.string().optional().describe("A short, actionable tip suggesting one or two items to complete or elevate the look."),
});
export type AnalyzePhotoPostOutput = z.infer<typeof AnalyzePhotoPostOutputSchema>;


// Schema for AI Style Coach
export const StyleCoachInputSchema = z.object({
  photoDataUri: z.string().describe("A photo of the user's outfit, as a data URI."),
  occasion: z.string().describe('The occasion for which the outfit is intended (e.g., "Work", "Party", "Casual").'),
});
export type StyleCoachInput = z.infer<typeof StyleCoachInputSchema>;

export const StyleCoachOutputSchema = z.object({
  harmonyScore: z.number().describe('A score from 1-100 for color/pattern harmony.'),
  trendScore: z.number().describe('A score from 1-100 for how trendy the outfit is.'),
  feedback: z.string().describe('A single, actionable tip to improve the outfit.'),
});
export type StyleCoachOutput = z.infer<typeof StyleCoachOutputSchema>;


// Schema for Celebrity Style Matcher
export const CelebStyleMatcherInputSchema = z.object({
  photoDataUri: z.string().describe("A photo of the user's outfit, as a data URI."),
});
export type CelebStyleMatcherInput = z.infer<typeof CelebStyleMatcherInputSchema>;

export const CelebStyleMatcherOutputSchema = z.object({
  celebrityMatch: z.string().describe("The name of the celebrity and the event of the matched look (e.g., 'Zendaya at the 2021 Oscars')."),
  matchReason: z.string().describe("A brief explanation of why the user's outfit matches the celebrity's look."),
  stylingTips: z.array(z.string()).describe("An array of 2-3 actionable styling tips inspired by the celebrity's look."),
  celebrityImageUrl: z.string().describe("The URL of the AI-generated image representing the celebrity's look, as a data URI."),
});
export type CelebStyleMatcherOutput = z.infer<typeof CelebStyleMatcherOutputSchema>;


// Schema for Explain Verdict
export const ExplainVerdictInputSchema = z.object({
  verdict: z.string().describe("The original one-sentence verdict that the AI provided."),
  tipsA: z.string().describe("The improvement tips provided for Outfit A."),
  tipsB: z.string().describe("The improvement tips provided for Outfit B."),
});
export type ExplainVerdictInput = z.infer<typeof ExplainVerdictInputSchema>;

export const ExplainVerdictOutputSchema = z.object({
  explanation: z.string().describe("A simple, conversational explanation of the verdict."),
});
export type ExplainVerdictOutput = z.infer<typeof ExplainVerdictOutputSchema>;


// Schema for Generate Verdict Card
export const GenerateVerdictCardInputSchema = z.object({
  outfitAImageUrl: z.string().describe('The image URL for Outfit A as a data URI.'),
  outfitBImageUrl: z.string().describe('The image URL for Outfit B as a data URI.'),
  verdict: z.string().describe("The concise, one-sentence verdict for the comparison."),
});
export type GenerateVerdictCardInput = z.infer<typeof GenerateVerdictCardInputSchema>;

export const GenerateVerdictCardOutputSchema = z.object({
  shareableImageUrl: z.string().describe("The data URI of the generated shareable image collage."),
});
export type GenerateVerdictCardOutput = z.infer<typeof GenerateVerdictCardOutputSchema>;


export const GenerateBoardFromMoodInputSchema = z.object({
  mood: z.string().describe("The user's mood or theme for the board."),
});
export type GenerateBoardFromMoodInput = z.infer<typeof GenerateBoardFromMoodInputSchema>;

export const GenerateBoardFromMoodOutputSchema = z.object({
  boardName: z.string().describe("A creative, catchy name for the moodboard."),
  pins: z.array(
    z.object({
      title: z.string().describe("A short, descriptive title for the pin."),
      imageUrl: z.string().url().describe("The URL of the generated image for the pin."),
      imagePrompt: z.string().describe("The prompt used to generate the pin's image."),
    })
  ).length(6).describe("An array of exactly 6 generated pins for the board."),
});
export type GenerateBoardFromMoodOutput = z.infer<typeof GenerateBoardFromMoodOutputSchema>;

export const CategorizeAndCaptionPinInputSchema = z.object({
  photoDataUri: z.string().describe("The uploaded photo as a data URI."),
});
export type CategorizeAndCaptionPinInput = z.infer<typeof CategorizeAndCaptionPinInputSchema>;


export const CategorizeAndCaptionPinOutputSchema = z.object({
  category: z.enum(['Streetwear', 'Y2K', 'Cottagecore', 'Minimalist', 'Formal', 'Vintage', 'Other']),
  caption: z.string().describe("A short, trendy, Instagram-style caption for the pin."),
});
export type CategorizeAndCaptionPinOutput = z.infer<typeof CategorizeAndCaptionPinOutputSchema>;
