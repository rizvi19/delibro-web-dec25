'use client'

import { useEffect, useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<'pending'|'success'|'error'>('pending')
  const supabase = createSupabaseClient()

  useEffect(() => {
    const run = async () => {
      try {
        await supabase.auth.exchangeCodeForSession(window.location.href)
        setStatus('success')
        // Redirect home once session is set
        window.location.replace('/')
      } catch {
        setStatus('error')
      }
    }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <p className="text-muted-foreground">
        {status === 'pending' && 'Completing sign-in...'}
        {status === 'success' && 'Signed in! Redirecting...'}
        {status === 'error' && 'Could not complete sign-in.'}
      </p>
    </div>
  )
}

