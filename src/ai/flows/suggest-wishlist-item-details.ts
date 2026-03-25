'use server';
/**
 * @fileOverview A Genkit flow for suggesting concise descriptions and relevant tags for wishlist items.
 *
 * - suggestWishlistItemDetails - A function that suggests details for a wishlist item.
 * - SuggestWishlistItemDetailsInput - The input type for the suggestWishlistItemDetails function.
 * - SuggestWishlistItemDetailsOutput - The return type for the suggestWishlistItemDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema: User provides either a title or a URL (or both)
const SuggestWishlistItemDetailsInputSchema = z.object({
  title: z.string().optional().describe('The title of the wishlist item.'),
  url: z.string().url().optional().describe('The URL of the wishlist item. The AI will infer details from this URL string.'),
}).refine(data => data.title !== undefined || data.url !== undefined, {
  message: 'Either title or URL must be provided.',
  path: ['title', 'url'],
});

export type SuggestWishlistItemDetailsInput = z.infer<typeof SuggestWishlistItemDetailsInputSchema>;

// Output Schema: AI suggests a description and a list of tags
const SuggestWishlistItemDetailsOutputSchema = z.object({
  suggestedDescription: z.string().describe('A concise, 1-2 sentence description for the wishlist item.'),
  suggestedTags: z.array(z.string()).max(5).describe('A list of up to 5 relevant tags for the wishlist item.'),
});

export type SuggestWishlistItemDetailsOutput = z.infer<typeof SuggestWishlistItemDetailsOutputSchema>;

// Wrapper function to call the Genkit flow
export async function suggestWishlistItemDetails(input: SuggestWishlistItemDetailsInput): Promise<SuggestWishlistItemDetailsOutput> {
  return suggestWishlistItemDetailsFlow(input);
}

// Define the Genkit prompt
const prompt = ai.definePrompt({
  name: 'suggestWishlistItemDetailsPrompt',
  input: {schema: SuggestWishlistItemDetailsInputSchema},
  output: {schema: SuggestWishlistItemDetailsOutputSchema},
  prompt: `You are an AI assistant specialized in enhancing wishlist item details.
Your task is to provide a concise description (1-2 sentences) and up to 5 relevant tags for a wishlist item based on the provided information.

If a URL is provided, infer details from the URL string itself and its common association, do not attempt to browse the URL.
Prioritize explicit title information over URL inference if both are present.

Here is the information about the wishlist item:

{{#if title}}
Title: {{{title}}}
{{/if}}

{{#if url}}
URL: {{{url}}}
{{/if}}

Please provide only the JSON output without any additional text or formatting.`,
});

// Define the Genkit flow
const suggestWishlistItemDetailsFlow = ai.defineFlow(
  {
    name: 'suggestWishlistItemDetailsFlow',
    inputSchema: SuggestWishlistItemDetailsInputSchema,
    outputSchema: SuggestWishlistItemDetailsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
