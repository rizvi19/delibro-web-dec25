'use client'

import { useEffect, useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

export default function UpdatePasswordPage() {
  const supabase = createSupabaseClient()
  const { toast } = useToast()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [pending, setPending] = useState(false)

  useEffect(() => {
    // Ensure any code in URL is exchanged for a session
    supabase.auth.exchangeCodeForSession(window.location.href).catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) {
      toast({ title: 'Oops!', description: 'Password must be at least 6 characters.', variant: 'destructive' })
      return
    }
    if (password !== confirm) {
      toast({ title: 'Oops!', description: 'Passwords do not match.', variant: 'destructive' })
      return
    }
    setPending(true)
    const { error } = await supabase.auth.updateUser({ password })
    setPending(false)
    if (error) {
      toast({ title: 'Oops!', description: error.message, variant: 'destructive' })
      return
    }
    toast({ title: 'Success!', description: 'Password updated. Please sign in.' })
    window.location.replace('/login')
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-accent/50 px-4">
      <Card className="w-full max-w-sm">
        <form onSubmit={onSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Set New Password</CardTitle>
            <CardDescription>Enter a new password for your account.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="password">New Password</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm">Confirm Password</Label>
              <Input id="confirm" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={pending}>
              {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Password
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

