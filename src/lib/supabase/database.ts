import { createSupabaseServerClient } from './server'

export type Profile = {
  id: string
  name: string
  phone: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

// Get user profile from database
export async function getUserProfile(userId: string): Promise<Profile | null> {
  const supabase = await createSupabaseServerClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching user profile:', error)
    return null
  }

  return data
}

// Update user profile
export async function updateUserProfile(userId: string, updates: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>) {
  const supabase = await createSupabaseServerClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating user profile:', error)
    throw error
  }

  return data
}

// Get current user with profile
export async function getCurrentUserWithProfile() {
  const supabase = await createSupabaseServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const profile = await getUserProfile(user.id)
  
  return {
    user,
    profile
  }
}
