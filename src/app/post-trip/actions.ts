'use server';

import { createServerClient } from '@supabase/ssr';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

// This is the same schema as in the page.tsx file.
// It's duplicated here to validate on the server.
const tripSchema = z.object({
  origin: z.string().min(1, 'Origin is required.'),
  destination: z.string().min(1, 'Destination is required.'),
  travelDate: z.string().min(1, 'Travel date is required.'),
  departureTime: z.string().min(1, 'Departure time is required.'),
  transportMode: z.enum(['bus', 'train', 'plane', 'other']),
  seatInfo: z.string().optional(),
  availableCapacity: z.string().min(1, 'Available capacity is required.'),
  notes: z.string().optional(),
});

export type TripFormState = {
  success: boolean;
  message: string;
  errors?: {
    [key: string]: string[];
  } | null;
};

export async function postTripAction(
  prevState: TripFormState,
  formData: FormData
): Promise<TripFormState> {
  const cookieStore = cookies();
  const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    );

    const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: 'You must be logged in to post a trip.',
      errors: null,
    };
  }


  const validatedFields = tripSchema.safeParse({
    origin: formData.get('origin'),
    destination: formData.get('destination'),
    travelDate: formData.get('travelDate'),
    departureTime: formData.get('departureTime'),
    transportMode: formData.get('transportMode'),
    seatInfo: formData.get('seatInfo'),
    availableCapacity: formData.get('availableCapacity'),
    notes: formData.get('notes'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Please check your inputs.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { data, error } = await supabase.from('trips').insert([
    {
      origin: validatedFields.data.origin,
      destination: validatedFields.data.destination,
      travel_date: validatedFields.data.travelDate,
      departure_time: validatedFields.data.departureTime,
      transport_mode: validatedFields.data.transportMode,
      seat_info: validatedFields.data.seatInfo,
      available_capacity: validatedFields.data.availableCapacity,
      notes: validatedFields.data.notes,
      user_id: user.id,
    },
  ]);

  if (error) {
    console.error('Supabase error:', error);
    return {
      success: false,
      message: 'Failed to post trip. Please try again.',
      errors: null,
    };
  }

  revalidatePath('/dashboard'); 
  return {
    success: true,
    message: 'Trip posted successfully!',
    errors: null,
  };
}
