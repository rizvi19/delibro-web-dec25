import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedFields = loginSchema.safeParse(body)
    
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

    const { email, password } = validatedFields.data
    const supabase = await createSupabaseServerClient()

    // Sign in user
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json(
        { 
          success: false, 
          message: error.message 
        },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: data.user?.id,
        email: data.user?.email,
        name: data.user?.user_metadata?.name,
        phone: data.user?.user_metadata?.phone,
        email_confirmed: !!data.user?.email_confirmed_at
      },
      session: {
        access_token: data.session?.access_token,
        refresh_token: data.session?.refresh_token,
        expires_at: data.session?.expires_at
      }
    })

  } catch (error) {
    console.error('Login API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}
