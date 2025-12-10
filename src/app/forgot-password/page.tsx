'use client'

import { useActionState, useEffect } from 'react'
import { sendReset, type ForgotState } from './actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import { useFormStatus } from 'react-dom'
import { Loader2 } from 'lucide-react'

function Submit() {
  const { pending } = useFormStatus()
  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Send Reset Link
    </Button>
  )
}

export default function ForgotPasswordPage() {
  const { toast } = useToast()
  const initial: ForgotState = { success: false, message: '' }
  const [state, action] = useActionState(sendReset, initial)

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? 'Email sent' : 'Oops!',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      })
    }
  }, [state, toast])

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-accent/50 px-4">
      <Card className="w-full max-w-sm">
        <form action={action}>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Forgot Password</CardTitle>
            <CardDescription>Enter your email to receive a reset link.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Submit />
            <div className="text-center text-sm text-muted-foreground">
              Back to <Link href="/login" className="underline text-primary hover:text-primary/80">Sign in</Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

