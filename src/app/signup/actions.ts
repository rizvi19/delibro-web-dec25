
'use server'

import { revalidatePath } from 'next/cache'
<<<<<<< HEAD
=======
import { redirect } from 'next/navigation'
>>>>>>> cf5971e (signup login backend)
import { z } from 'zod'
import { createSupabaseServerClient } from '@/lib/supabase/server'

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
<<<<<<< HEAD
  const supabase = createSupabaseServerClient();
=======
  const supabase = await createSupabaseServerClient();
>>>>>>> cf5971e (signup login backend)

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

<<<<<<< HEAD
  const { error } = await supabase.auth.signUp({
=======
  const { data, error } = await supabase.auth.signUp({
>>>>>>> cf5971e (signup login backend)
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

<<<<<<< HEAD
  revalidatePath('/', 'layout')

=======
  // If signup was successful and user is immediately confirmed (no email verification needed)
  if (data.user && !data.user.email_confirmed_at) {
    revalidatePath('/', 'layout')
    return {
      success: true,
      message: 'Signed up successfully! Please check your email to verify your account.',
    }
  } else if (data.user && data.user.email_confirmed_at) {
    // User is immediately confirmed, redirect to dashboard
    revalidatePath('/', 'layout')
    return {
      success: true,
      message: 'Signed up successfully! Welcome to delibro.',
    }
  }

  revalidatePath('/', 'layout')
>>>>>>> cf5971e (signup login backend)
  return {
    success: true,
    message: 'Signed up successfully! Please check your email to verify your account.',
  }
}
