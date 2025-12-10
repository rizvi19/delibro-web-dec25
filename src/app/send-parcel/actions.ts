
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/auth';
import { uploadBase64Image } from '@/lib/storage';
import { getDistance } from '@/lib/distance-matrix';

const parcelSchema = z.object({
  origin: z.string().min(1, 'Origin is required.'),
  destination: z.string().min(1, 'Destination is required.'),
  parcelDetails: z.string().min(1, 'Parcel details are required.'),
  parcelWeight: z.string().min(1, 'Parcel weight is required.'),
  deliveryDate: z.string().min(1, 'Desired delivery date is required.'),
  size: z.enum(['small','medium','large','xl']).default('medium'),
  pickupStart: z.string().optional(),
  pickupEnd: z.string().optional(),
  deliveryStart: z.string().optional(),
  deliveryEnd: z.string().optional(),
  notes: z.string().optional(),
  parcelImageData: z.string().optional(),
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

  const gate = await requireRole(['sender', 'admin'])
  if (!gate.ok) {
    return {
      success: false,
      message: gate.message || 'Only senders can post parcel requests.',
      errors: null,
    }
  }

  const validatedFields = parcelSchema.safeParse({
    origin: formData.get('origin'),
    destination: formData.get('destination'),
    parcelDetails: formData.get('parcelDetails'),
    parcelWeight: formData.get('parcelWeight'),
    deliveryDate: formData.get('deliveryDate'),
    size: formData.get('size') || 'medium',
    pickupStart: formData.get('pickupStart') || undefined,
    pickupEnd: formData.get('pickupEnd') || undefined,
    deliveryStart: formData.get('deliveryStart') || undefined,
    deliveryEnd: formData.get('deliveryEnd') || undefined,
    notes: formData.get('notes'),
    parcelImageData: formData.get('parcelImageData'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Please check your inputs.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  let imageUrl: string | null = null
  if (validatedFields.data.parcelImageData) {
    imageUrl = await uploadBase64Image(validatedFields.data.parcelImageData, user.id)
  }

  const distance = getDistance(
    String(validatedFields.data.origin).toLowerCase(),
    String(validatedFields.data.destination).toLowerCase()
  )
  let priceEstimate: number | null = null
  if (distance !== -1) {
    const sizeMultiplier = validatedFields.data.size === 'small' ? 1.5 : validatedFields.data.size === 'medium' ? 2.5 : validatedFields.data.size === 'large' ? 4 : 6
    priceEstimate = Math.round(0.75 * distance + 10 * sizeMultiplier)
  }

  const { data, error } = await supabase.from('parcels').insert([
    {
      origin: validatedFields.data.origin,
      destination: validatedFields.data.destination,
      details: validatedFields.data.parcelDetails,
      weight_kg: parseFloat(validatedFields.data.parcelWeight),
      size: validatedFields.data.size,
      price_estimate: priceEstimate ?? null,
      pickup_time_start: validatedFields.data.pickupStart || null,
      pickup_time_end: validatedFields.data.pickupEnd || null,
      delivery_time_start: validatedFields.data.deliveryStart || null,
      delivery_time_end: validatedFields.data.deliveryEnd || null,
      desired_delivery_date: validatedFields.data.deliveryDate,
      notes: validatedFields.data.notes,
      image_url: imageUrl ?? null,
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
