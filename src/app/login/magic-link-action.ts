'use server'

import { z } from 'zod'
import { createSupabaseServerClient } from '@/lib/supabase/server'

const schema = z.object({ email: z.string().email('Invalid email.') })

export type MagicLinkState = { success: boolean; message: string }

export async function sendMagicLink(prev: MagicLinkState, formData: FormData): Promise<MagicLinkState> {
  const parsed = schema.safeParse({ email: formData.get('email') })
  if (!parsed.success) {
    return { success: false, message: parsed.error.flatten().fieldErrors.email?.[0] || 'Invalid email.' }
  }
  const supabase = createSupabaseServerClient()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: { emailRedirectTo: `${siteUrl}/auth/callback` },
  })
  if (error) return { success: false, message: error.message }
  return { success: true, message: 'Magic link sent. Check your email.' }
}

