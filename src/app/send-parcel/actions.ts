'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const parcelSchema = z.object({
  origin: z.string().min(1, 'Origin is required.'),
  destination: z.string().min(1, 'Destination is required.'),
  parcelDetails: z.string().min(1, 'Parcel details are required.'),
  parcelWeight: z.string().min(1, 'Parcel weight is required.'),
  deliveryDate: z.string().min(1, 'Desired delivery date is required.'),
  notes: z.string().optional(),
});

export type ParcelFormState = {
  success: boolean;
  message: string;
  errors?: {
    [key: string]: string[];
  } | null;
};

export async function sendParcelAction(
  prevState: ParcelFormState,
  formData: FormData
): Promise<ParcelFormState> {
   const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: 'You must be logged in to send a parcel.',
      errors: null,
    };
  }

  const validatedFields = parcelSchema.safeParse({
    origin: formData.get('origin'),
    destination: formData.get('destination'),
    parcelDetails: formData.get('parcelDetails'),
    parcelWeight: formData.get('parcelWeight'),
    deliveryDate: formData.get('deliveryDate'),
    notes: formData.get('notes'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Please check your inputs.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { data, error } = await supabase.from('parcels').insert([
    {
      origin: validatedFields.data.origin,
      destination: validatedFields.data.destination,
      details: validatedFields.data.parcelDetails,
      weight_kg: parseFloat(validatedFields.data.parcelWeight),
      desired_delivery_date: validatedFields.data.deliveryDate,
      notes: validatedFields.data.notes,
      user_id: user.id,
    },
  ]);

  if (error) {
    console.error('Supabase error:', error);
    return {
      success: false,
      message: 'Failed to post parcel request. Please try again.',
      errors: null,
    };
  }

  revalidatePath('/dashboard');
  return {
    success: true,
    message: 'Parcel request posted successfully!',
    errors: null,
  };
}
