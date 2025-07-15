
// src/ai/flows/ai-chatbot.ts
'use server';
/**
 * @fileOverview An AI chatbot for mental health support.
 *
 * - chatWithAi - A function that handles the chatbot conversation.
 * - ChatWithAiInput - The input type for the chatWithAi function.
 * - ChatWithAiOutput - The return type for the chatWithAi function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatWithAiInputSchema = z.object({
  message: z.string().describe('The user message to the chatbot.'),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'bot']),
    content: z.string(),
  })).optional().describe('The chat history between the user and the bot.'),
});
export type ChatWithAiInput = z.infer<typeof ChatWithAiInputSchema>;

const ChatWithAiOutputSchema = z.object({
  response: z.string().describe('The chatbot response to the user message.'),
});
export type ChatWithAiOutput = z.infer<typeof ChatWithAiOutputSchema>;

export async function chatWithAi(input: ChatWithAiInput): Promise<ChatWithAiOutput> {
  return chatWithAiFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiChatbotPrompt',
  input: {schema: ChatWithAiInputSchema},
  output: {schema: ChatWithAiOutputSchema},
  prompt: `You are a mental health support chatbot providing empathetic, non-clinical responses to students. 

Respond to the user message, considering the chat history to maintain context. Be supportive and understanding.

Chat History:
{{#each chatHistory}}
  {{#if this.isUser}}User: {{this.content}}{{/if}}
  {{#if this.isBot}}Bot: {{this.content}}{{/if}}
{{/each}}

User Message: {{message}}

Bot:`, 
});

const chatWithAiFlow = ai.defineFlow(
  {
    name: 'chatWithAiFlow',
    inputSchema: ChatWithAiInputSchema,
    outputSchema: ChatWithAiOutputSchema,
  },
  async input => {
    // Add isUser and isBot flags for Handlebars templating
    const processedHistory = input.chatHistory?.map(entry => ({
        ...entry,
        isUser: entry.role === 'user',
        isBot: entry.role === 'bot',
    }));

    const {output} = await prompt({ ...input, chatHistory: processedHistory });
    return output!;
  }
);
