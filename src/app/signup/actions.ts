
'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createSupabaseServerClient } from '@/lib/supabase/server'

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  role: z.enum(['sender','traveler']).default('sender'),
})

export type SignupFormState = {
  success: boolean
  message: string
}

export async function signup(prevState: SignupFormState, formData: FormData): Promise<SignupFormState> {
  const supabase = createSupabaseServerClient();

  const validatedFields = signupSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    password: formData.get('password'),
    role: formData.get('role'),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      message: Object.values(validatedFields.error.flatten().fieldErrors).flat()[0] || 'Invalid input.'
    }
  }

  const { name, email, phone, password, role } = validatedFields.data

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name,
        phone: phone,
        role: role,
      },
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  })

  if (error) {
    return {
      success: false,
      message: error.message,
    }
  }

  revalidatePath('/', 'layout')

  return {
    success: true,
    message: 'Signed up successfully! Please check your email to verify your account.',
  }
}
