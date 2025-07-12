'use server';

import {
  suggestMeetingPoint,
  type SuggestMeetingPointInput,
  type SuggestMeetingPointOutput,
} from '@/ai/flows/suggest-meeting-point';

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
