import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  try {
    const body = await request.json()
    const { status, adminNotes } = body
    if (!['approved','rejected'].includes(status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    const upd: any = { status }
    if (adminNotes) upd.admin_notes = adminNotes
    if (status === 'approved') upd.verified_at = new Date().toISOString()
    const { error } = await supabase.from('kyc_submissions').update(upd).eq('id', params.id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('KYC update error', e)
    return NextResponse.json({ error: 'Failed to update KYC' }, { status: 500 })
  }
}

