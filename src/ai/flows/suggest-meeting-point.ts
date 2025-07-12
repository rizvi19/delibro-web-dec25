// src/ai/flows/suggest-meeting-point.ts
'use server';

/**
 * @fileOverview Suggests an optimal meeting point and time for travelers and recipients.
 *
 * - suggestMeetingPoint - A function that suggests the meeting point.
 * - SuggestMeetingPointInput - The input type for the suggestMeetingPoint function.
 * - SuggestMeetingPointOutput - The return type for the suggestMeetingPoint function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestMeetingPointInputSchema = z.object({
  travelerLocation: z
    .string()
    .describe('The current location of the traveler.'),
  recipientLocation: z
    .string()
    .describe('The current location of the recipient.'),
  travelRoute: z
    .string()
    .describe('The travel route from origin to destination.'),
  travelDate: z.string().describe('The date of travel.'),
  availableCapacity: z.string().describe('The available capacity for parcel transfer'),
  trafficConditions: z
    .string()
    .describe('Real-time traffic conditions along the route.'),
});

export type SuggestMeetingPointInput = z.infer<
  typeof SuggestMeetingPointInputSchema
>;

const SuggestMeetingPointOutputSchema = z.object({
  suggestedMeetingPoint: z
    .string()
    .describe('The suggested meeting point location.'),
  suggestedMeetingTime: z
    .string()
    .describe('The suggested meeting time.'),
  reasoning: z
    .string()
    .describe('The AI reasoning for the suggested meeting point and time.'),
});

export type SuggestMeetingPointOutput = z.infer<
  typeof SuggestMeetingPointOutputSchema
>;

export async function suggestMeetingPoint(
  input: SuggestMeetingPointInput
): Promise<SuggestMeetingPointOutput> {
  return suggestMeetingPointFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestMeetingPointPrompt',
  input: {schema: SuggestMeetingPointInputSchema},
  output: {schema: SuggestMeetingPointOutputSchema},
  prompt: `You are an AI travel assistant specializing in suggesting optimal meeting points and times for travelers and recipients.

  Consider the following information to suggest the best meeting point and time:

  Traveler Location: {{{travelerLocation}}}
  Recipient Location: {{{recipientLocation}}}
  Travel Route: {{{travelRoute}}}
  Travel Date: {{{travelDate}}}
  Available Capacity: {{{availableCapacity}}}
  Traffic Conditions: {{{trafficConditions}}}

  Suggest a specific meeting point location and time, providing a clear explanation for your recommendation in the reasoning field.
  Be mindful of real-time traffic and location data to facilitate smooth handovers.
`,
});

const suggestMeetingPointFlow = ai.defineFlow(
  {
    name: 'suggestMeetingPointFlow',
    inputSchema: SuggestMeetingPointInputSchema,
    outputSchema: SuggestMeetingPointOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
