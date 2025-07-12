'use server'

import { createServerClient } from '@supabase/ssr'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { z } from 'zod'

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
})

export type SignupFormState = {
  success: boolean
  message: string
}

export async function signup(prevState: SignupFormState, formData: FormData): Promise<SignupFormState> {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  const validatedFields = signupSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      message: Object.values(validatedFields.error.flatten().fieldErrors).flat()[0] || 'Invalid input.'
    }
  }

  const { name, email, phone, password } = validatedFields.data

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name,
        phone: phone,
      },
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
