'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { login, type LoginFormState } from './actions';
import { useActionState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button className="w-full" type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
        </Button>
    )
}

export default function LoginPage() {
    const router = useRouter();
    const { toast } = useToast();
    const initialState: LoginFormState = {
        success: false,
        message: '',
    };

    const [state, formAction] = useActionState(login, initialState);

    useEffect(() => {
        if (!state.success && state.message) {
            toast({
                title: "Oops!",
                description: state.message,
                variant: 'destructive'
            });
        }
        if (state.success) {
            toast({
                title: "Success!",
                description: state.message,
            });
            router.push('/');
        }
    }, [state, toast, router]);

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-accent/50 px-4">
            <Card className="w-full max-w-sm">
                <form action={formAction}>
                    <CardHeader>
                        <CardTitle className="text-2xl font-headline">Sign In</CardTitle>
                        <CardDescription>
                            Enter your email below to login to your account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <SubmitButton />
                        <div className="text-center text-sm text-muted-foreground">
                            Don&apos;t have an account?{' '}
                            <Link href="/signup" className="underline text-primary hover:text-primary/80">
                                Sign up
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
