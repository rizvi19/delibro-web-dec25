import { createBrowserClient } from '@supabase/ssr'
<<<<<<< HEAD

export function createSupabaseClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
=======
import { env } from '@/lib/env'

export function createSupabaseClient() {
    return createBrowserClient(
        env.NEXT_PUBLIC_SUPABASE_URL,
        env.NEXT_PUBLIC_SUPABASE_ANON_KEY
>>>>>>> cf5971e (signup login backend)
    )
}
