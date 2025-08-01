'use server';

import {
  suggestMeetingPoint,
  type SuggestMeetingPointInput,
  type SuggestMeetingPointOutput,
} from '@/ai/flows/suggest-meeting-point';
import { helplineFlow } from '@/ai/flows/helpline-flow';

type SuggestionResult =
  | { success: true; data: SuggestMeetingPointOutput }
  | { success: false; error: string };

export async function getMeetingPointSuggestion(
  input: SuggestMeetingPointInput
): Promise<SuggestionResult> {
  try {
    const result = await suggestMeetingPoint(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in getMeetingPointSuggestion:', error);
    return {
      success: false,
      error: 'Failed to get suggestion. Please try again later.',
    };
  }
}

type HelplineResult = 
  | { success: true; data: string }
  | { success: false; error: string };

export async function askHelpline(
  question: string
): Promise<HelplineResult> {
  try {
    const result = await helplineFlow(question);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in askHelpline:', error);
    return {
      success: false,
      error: 'Failed to get a response from the AI. Please try again.',
    };
  }
}
