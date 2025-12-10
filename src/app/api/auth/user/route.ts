import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()

    // Sign out user
    const { error } = await supabase.auth.signOut()

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
      message: 'Logout successful'
    })

  } catch (error) {
    console.error('Logout API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()

    // Get current user
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
      return NextResponse.json(
        { 
          success: false, 
          message: error.message 
        },
        { status: 401 }
      )
    }

    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'No authenticated user' 
        },
        { status: 401 }
      )
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name,
        phone: user.user_metadata?.phone,
        email_confirmed: !!user.email_confirmed_at,
        created_at: user.created_at,
        role: profile?.role || null,
      }
    })

  } catch (error) {
    console.error('User API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}
