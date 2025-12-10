import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { z } from 'zod'

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  role: z.enum(['sender','traveler']).default('sender'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedFields = signupSchema.safeParse(body)
    
    if (!validatedFields.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation failed',
          errors: validatedFields.error.flatten().fieldErrors 
        },
        { status: 400 }
      )
    }

    const { name, email, phone, password, role } = validatedFields.data
    const supabase = await createSupabaseServerClient()

    // Sign up user
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const { data, error } = await supabase.auth.signUp({
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
      return NextResponse.json(
        { 
          success: false, 
          message: error.message 
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: {
        id: data.user?.id,
        email: data.user?.email,
        name: data.user?.user_metadata?.name,
        phone: data.user?.user_metadata?.phone,
        role: data.user?.user_metadata?.role,
        email_confirmed: !!data.user?.email_confirmed_at
      }
    })

  } catch (error) {
    console.error('Signup API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}
