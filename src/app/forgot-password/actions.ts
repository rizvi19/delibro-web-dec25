'use server'

import { z } from 'zod'
import { createSupabaseServerClient } from '@/lib/supabase/server'

const schema = z.object({ email: z.string().email('Invalid email address.') })

export type ForgotState = { success: boolean; message: string }

export async function sendReset(prev: ForgotState, formData: FormData): Promise<ForgotState> {
  const validated = schema.safeParse({ email: formData.get('email') })
  if (!validated.success) {
    return { success: false, message: validated.error.flatten().fieldErrors.email?.[0] || 'Invalid email.' }
  }

  const supabase = createSupabaseServerClient()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const { error } = await supabase.auth.resetPasswordForEmail(validated.data.email, {
    redirectTo: `${siteUrl}/update-password`,
  })

  if (error) {
    return { success: false, message: error.message }
  }
  return { success: true, message: 'Password reset email sent. Check your inbox.' }
}

