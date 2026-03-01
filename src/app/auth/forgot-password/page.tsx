'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import { Mail, Loader2, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        const { error } = await resetPassword(email);
        setIsLoading(false);
        if (error) { setError(error); return; }
        setSent(true);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
            <div className="w-full max-w-md">
                <div className="bg-card border border-border/60 rounded-2xl shadow-2xl p-8 space-y-6">
                    <div className="flex flex-col items-center gap-2 mb-2">
                        <div className="flex items-center gap-2">
                            <Logo />
                            <span className="font-headline text-2xl font-bold text-primary">SmartDrobe</span>
                        </div>
                        <h1 className="text-xl font-semibold">Reset your password</h1>
                        <p className="text-sm text-muted-foreground text-center">
                            Enter your email and we&apos;ll send you a reset link.
                        </p>
                    </div>

                    {sent ? (
                        <div className="text-center space-y-4">
                            <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto" />
                            <p className="text-sm text-muted-foreground">
                                Check your inbox — a reset link has been sent to <strong>{email}</strong>.
                            </p>
                            <Link href="/auth/login">
                                <Button variant="outline" className="w-full">Back to Login</Button>
                            </Link>
                        </div>
                    ) : (
                        <>
                            {error && (
                                <div className="flex items-center gap-2 bg-destructive/10 text-destructive text-sm rounded-lg px-4 py-3">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full h-11" disabled={isLoading}>
                                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…</> : 'Send Reset Link'}
                                </Button>
                            </form>
                            <Link href="/auth/login" className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                                <ArrowLeft className="h-3.5 w-3.5" />
                                Back to login
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
