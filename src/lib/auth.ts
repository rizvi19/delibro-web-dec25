import { createSupabaseServerClient } from '@/lib/supabase/server'

export type UserRole = 'sender' | 'traveler' | 'admin'

export async function getCurrentUserRole(): Promise<UserRole | null> {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Try reading profile
  let { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  // Backfill profile if missing
  if (!profile) {
    const fallbackRole = (user.user_metadata?.role as UserRole) || 'sender'
    const fallbackName = (user.user_metadata?.name as string) || ''
    const fallbackPhone = (user.user_metadata?.phone as string) || ''

    await supabase
      .from('profiles')
      .upsert({ id: user.id, name: fallbackName, phone: fallbackPhone, role: fallbackRole }, {
        onConflict: 'id',
      })

    const { data: reprofile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    profile = reprofile ?? undefined
  }

  return (profile?.role as UserRole) || (user.user_metadata?.role as UserRole) || null
}

export async function requireRole(allowed: UserRole[]): Promise<{ ok: boolean; role?: UserRole; message?: string }> {
  const role = await getCurrentUserRole()
  // For now, allow both sender and traveler to use both features since one user can act as both.
  if (!role) return { ok: false, message: 'You must be logged in.' }
  if (allowed.includes(role) || role === 'admin' || (allowed.includes('sender') && role === 'traveler') || (allowed.includes('traveler') && role === 'sender')) {
    return { ok: true, role }
  }
  return { ok: false, role, message: 'Insufficient permissions for this action.' }
}

export async function requireKycApproved(): Promise<{ ok: boolean; message?: string }> {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, message: 'You must be logged in.' }
  const { data } = await supabase
    .from('kyc_submissions')
    .select('status')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
  const approved = data && data[0] && data[0].status === 'approved'
  return { ok: !!approved, message: approved ? undefined : 'KYC not approved yet. Please complete KYC.' }
}
