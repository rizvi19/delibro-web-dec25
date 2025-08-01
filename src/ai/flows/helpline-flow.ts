// src/ai/flows/helpline-flow.ts
'use server';

/**
 * @fileOverview A simple AI helpline to answer user questions about the service.
 *
 * - helplineFlow - A function that answers a user's question.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const prompt = ai.definePrompt({
  name: 'helplinePrompt',
  input: { schema: z.string() },
  output: { schema: z.string() },
  prompt: `You are a friendly and helpful AI assistant for an app called 'delibro'.
  Your purpose is to answer user questions about how the delibro service works.
  delibro is a platform that connects travelers with people who need to send parcels.
  
  Keep your answers concise, clear, and friendly. When you mention the app name, just say "delibro".

  User's question: {{{prompt}}}
`,
});

export const helplineFlow = ai.defineFlow(
  {
    name: 'helplineFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (question) => {
    const { output } = await prompt(question);
    return output || "I'm sorry, I don't have an answer for that right now.";
  }
);
