'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating personalized product recommendations.
 *
 * - personalizedProductRecommendations - A function that generates personalized product recommendations for a user.
 * - PersonalizedProductRecommendationsInput - The input type for the personalizedProductRecommendations function.
 * - PersonalizedProductRecommendationsOutput - The output type for the personalizedProductRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedProductRecommendationsInputSchema = z.object({
  userId: z.string().describe('The ID of the user to generate recommendations for.'),
  browsingHistory: z.array(z.string()).describe('A list of product IDs representing the user\'s browsing history.'),
  purchaseHistory: z.array(z.string()).describe('A list of product IDs representing the user\'s purchase history.'),
});
export type PersonalizedProductRecommendationsInput = z.infer<typeof PersonalizedProductRecommendationsInputSchema>;

const PersonalizedProductRecommendationsOutputSchema = z.object({
  productRecommendations: z.array(z.string()).describe('A list of product IDs recommended for the user.'),
});
export type PersonalizedProductRecommendationsOutput = z.infer<typeof PersonalizedProductRecommendationsOutputSchema>;

export async function personalizedProductRecommendations(input: PersonalizedProductRecommendationsInput): Promise<PersonalizedProductRecommendationsOutput> {
  return personalizedProductRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedProductRecommendationsPrompt',
  input: {schema: PersonalizedProductRecommendationsInputSchema},
  output: {schema: PersonalizedProductRecommendationsOutputSchema},
  prompt: `You are an expert e-commerce recommendation system.

You will generate a list of product recommendations for a user based on their browsing history and purchase history.

User ID: {{{userId}}}
Browsing History: {{#each browsingHistory}}{{{this}}}, {{/each}}
Purchase History: {{#each purchaseHistory}}{{{this}}}, {{/each}}

Based on this information, what products would you recommend? Return a list of product IDs.`, 
});

const personalizedProductRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedProductRecommendationsFlow',
    inputSchema: PersonalizedProductRecommendationsInputSchema,
    outputSchema: PersonalizedProductRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
