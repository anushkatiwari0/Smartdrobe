'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { friendlyAuthError } from '@/lib/error-handler';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { Loader } from '@/components/ui/loader';

export default function LoginPage() {
    const { signIn } = useAuth();
    const searchParams = useSearchParams();
    const nextUrl = searchParams.get('next') || '/dashboard';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [forgotSent, setForgotSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        const { error } = await signIn(email, password);
        if (error) {
            setError(friendlyAuthError(error));
            setIsLoading(false);
        }
        // On success, signIn() redirects to /dashboard
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-card border border-border/60 rounded-2xl shadow-2xl p-8 space-y-6">
                    {/* Logo */}
                    <div className="flex flex-col items-center gap-2 mb-2">
                        <div className="flex items-center gap-2">
                            <Logo />
                            <span className="font-headline text-2xl font-bold text-primary">SmartDrobe</span>
                        </div>
                        <h1 className="text-xl font-semibold text-foreground">Welcome back</h1>
                        <p className="text-sm text-muted-foreground">Sign in to your personal wardrobe</p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="flex items-center gap-2 bg-destructive/10 text-destructive text-sm rounded-lg px-4 py-3">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Form */}
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
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link
                                    href="/auth/forgot-password"
                                    className="text-xs text-primary hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 pr-10"
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11"
                            disabled={isLoading}
                        >
                            {isLoading
                                ? <Loader size={16} label="Signing in…" />
                                : 'Sign In'
                            }
                        </Button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground">
                        Don&apos;t have an account?{' '}
                        <Link href="/auth/signup" className="text-primary font-medium hover:underline">
                            Create one free
                        </Link>
                    </p>
                </div>

                <p className="text-center text-xs text-muted-foreground mt-4">
                    By signing in, you agree to our{' '}
                    <Link href="#" className="hover:underline">Terms</Link>{' '}
                    and{' '}
                    <Link href="#" className="hover:underline">Privacy Policy</Link>.
                </p>
            </div>
        </div>
    );
}
