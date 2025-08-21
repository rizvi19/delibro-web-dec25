import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getUserProfile } from '@/lib/supabase/database'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()

    // Get current user
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Not authenticated' 
        },
        { status: 401 }
      )
    }

    // Get user profile from database
    const profile = await getUserProfile(user.id)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name,
        phone: user.user_metadata?.phone,
        email_confirmed: !!user.email_confirmed_at,
        created_at: user.created_at
      },
      profile: profile
    })

  } catch (error) {
    console.error('Profile API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}
