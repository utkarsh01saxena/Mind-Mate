'use server';

/**
 * @fileOverview AI-powered self-care suggestion engine.
 *
 * - getSelfCareSuggestions - A function that provides personalized self-care suggestions based on mood data.
 * - SelfCareSuggestionsInput - The input type for the getSelfCareSuggestions function.
 * - SelfCareSuggestionsOutput - The return type for the getSelfCareSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SelfCareSuggestionsInputSchema = z.object({
  moodData: z
    .string()
    .describe(
      'A string representing the user\'s mood data. Include specific emotions and any journal entries.'
    ),
});
export type SelfCareSuggestionsInput = z.infer<typeof SelfCareSuggestionsInputSchema>;

const SuggestionSchema = z.object({
  title: z.string().describe('A short, catchy title for the self-care activity.'),
  description: z.string().describe('A brief, actionable description of the activity.'),
});

const SelfCareSuggestionsOutputSchema = z.object({
  suggestions: z.array(SuggestionSchema).describe(
    'An array of 3 realistic and actionable self-care suggestions tailored to the user\'s mood, including a mix of mindfulness activities, creative prompts, and simple physical activities.'
  ),
});
export type SelfCareSuggestionsOutput = z.infer<typeof SelfCareSuggestionsOutputSchema>;

export async function getSelfCareSuggestions(input: SelfCareSuggestionsInput): Promise<SelfCareSuggestionsOutput> {
  return selfCareSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'selfCareSuggestionsPrompt',
  input: {schema: SelfCareSuggestionsInputSchema},
  output: {schema: SelfCareSuggestionsOutputSchema},
  prompt: `You are a supportive AI companion. Based on the user's mood and journal entry, provide a list of exactly 3 personalized, realistic, and actionable self-care suggestions.

Each suggestion should have a short, catchy title and a clear, concise description.

Your suggestions should be creative and diverse. Mix and match from the following categories:
- A simple mindfulness or breathing exercise.
- A creative prompt (e.g., "doodle a place that feels safe," "write a short poem about the color blue").
- A light physical activity (e.g., "do 5 minutes of gentle stretching," "walk around your block and notice three new things").
- A small, comforting activity (e.g., "make a warm cup of tea and savor it," "listen to one favorite song without distractions").

Make the suggestions specific and easy to start right away.

Mood Data: {{{moodData}}}`,
});

const selfCareSuggestionsFlow = ai.defineFlow(
  {
    name: 'selfCareSuggestionsFlow',
    inputSchema: SelfCareSuggestionsInputSchema,
    outputSchema: SelfCareSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
