'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MapPin, Palette, User2, Shirt, ArrowRight, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';

// ─── Data ────────────────────────────────────────────────────────────────────

const STYLE_OPTIONS = ['Casual', 'Minimalist', 'Streetwear', 'Formal', 'Bohemian', 'Preppy', 'Athleisure', 'Vintage', 'Y2K', 'Cottagecore'];
const OCCASIONS = [
    { id: 'everyday', label: 'Everyday', emoji: '☀️' },
    { id: 'work', label: 'Work / Office', emoji: '💼' },
    { id: 'parties', label: 'Parties', emoji: '🎉' },
    { id: 'gym', label: 'Gym / Sport', emoji: '🏋️' },
    { id: 'dates', label: 'Date Nights', emoji: '🌙' },
    { id: 'travel', label: 'Travel', emoji: '✈️' },
    { id: 'formal', label: 'Formal Events', emoji: '🎩' },
    { id: 'brunch', label: 'Brunch', emoji: '🥐' },
];

// ─── Step helpers ─────────────────────────────────────────────────────────────

const STEPS = [
    { id: 'welcome', icon: Sparkles, title: 'Welcome to SmartDrobe! 👗', subtitle: 'Your AI-powered wardrobe is ready. Let\'s personalize it in just 4 quick steps.' },
    { id: 'city', icon: MapPin, title: 'Where are you based?', subtitle: 'We\'ll use your city for real-time weather-aware outfit recommendations.' },
    { id: 'style', icon: Palette, title: 'What\'s your style?', subtitle: 'Pick styles that resonate with you. You can always change this later.' },
    { id: 'gender', icon: User2, title: 'What occasions do you dress for?', subtitle: 'We\'ll prioritize recommendations that match your lifestyle.' },
    { id: 'upload', icon: Shirt, title: 'Add your first wardrobe item', subtitle: 'Upload a clothing photo and let AI catalog it for you instantly.' },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
    onComplete: () => void;
}

export default function OnboardingFlow({ onComplete }: Props) {
    const { user } = useAuth();
    const router = useRouter();

    const [step, setStep] = useState(0);
    const [city, setCity] = useState('');
    const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
    const [selectedGender, setSelectedGender] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const isLast = step === STEPS.length - 1;
    const current = STEPS[step];

    const toggleStyle = (s: string) =>
        setSelectedStyles(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

    const canAdvance = () => {
        if (step === 1) return city.trim().length >= 2;
        if (step === 2) return selectedStyles.length > 0;
        if (step === 3) return selectedGender !== '';
        return true; // welcome & upload steps always allow next
    };

    const saveAndComplete = async () => {
        if (!user) return;
        setIsSaving(true);
        const supabase = createClient();

        try {
            // Save city to profiles
            await supabase.from('profiles').upsert({
                id: user.id,
                location_city: city,
                onboarding_completed: true,
            });

            // Save style preferences
            await fetch('/api/user/preferences', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    style_keywords: selectedStyles,
                    gender_style: selectedGender,
                    location_city: city,
                }),
            });

            // Mark in localStorage so we don't flash on re-login
            localStorage.setItem('onboarding_completed', 'true');
        } catch { /* silent — don't block the user */ }

        setIsSaving(false);
        onComplete();
    };

    const handleNext = async () => {
        if (step === 3) {
            // Save after gender step before showing upload prompt
            await saveAndComplete();
            setStep(s => s + 1);
            return;
        }
        if (isLast) {
            router.push('/closet');
            return;
        }
        setStep(s => s + 1);
    };

    const handleSkip = () => {
        if (isLast) { onComplete(); return; }
        if (step === 3) saveAndComplete().then(() => setStep(s => s + 1));
        else setStep(s => s + 1);
    };

    return (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-lg">

                {/* Progress dots */}
                <div className="flex justify-center gap-2 mb-8">
                    {STEPS.map((_, i) => (
                        <div
                            key={i}
                            className={cn(
                                'h-2 rounded-full transition-all duration-300',
                                i === step ? 'w-6 bg-primary' : i < step ? 'w-2 bg-primary/50' : 'w-2 bg-muted'
                            )}
                        />
                    ))}
                </div>

                {/* Card */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -24 }}
                        transition={{ duration: 0.25 }}
                        className="bg-card border border-border/60 rounded-2xl shadow-2xl p-8 space-y-6"
                    >
                        {/* Icon */}
                        <div className="flex justify-center">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <current.icon className="h-8 w-8 text-primary" />
                            </div>
                        </div>

                        {/* Title */}
                        <div className="text-center space-y-1">
                            <h2 className="text-2xl font-bold font-headline">{current.title}</h2>
                            <p className="text-muted-foreground text-sm">{current.subtitle}</p>
                        </div>

                        {/* Step content */}
                        {step === 0 && (
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                {['👗 Digitize your closet', '🤖 AI outfit suggestions', '🌤️ Weather-aware picks', '👤 Personal style profile'].map(f => (
                                    <div key={f} className="flex items-center gap-2 bg-muted/40 rounded-lg p-3">
                                        <Check className="h-4 w-4 text-primary shrink-0" />
                                        <span>{f}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {step === 1 && (
                            <div className="space-y-2">
                                <Input
                                    autoFocus
                                    placeholder="e.g. Mumbai, London, New York"
                                    value={city}
                                    onChange={e => setCity(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && canAdvance() && handleNext()}
                                    className="text-center text-base h-11"
                                />
                                <p className="text-xs text-muted-foreground text-center">We never share your location</p>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="flex flex-wrap gap-2 justify-center">
                                {STYLE_OPTIONS.map(s => (
                                    <Badge
                                        key={s}
                                        variant={selectedStyles.includes(s) ? 'default' : 'outline'}
                                        className="cursor-pointer select-none transition-all hover:scale-105 text-sm py-1.5 px-3"
                                        onClick={() => toggleStyle(s)}
                                    >
                                        {s}
                                    </Badge>
                                ))}
                            </div>
                        )}

                        {step === 3 && (
                            <div className="grid grid-cols-2 gap-3">
                                {OCCASIONS.map(o => (
                                    <button
                                        key={o.id}
                                        onClick={() => setSelectedGender(o.id)}
                                        className={cn(
                                            'rounded-xl border-2 p-4 text-center transition-all hover:scale-105',
                                            selectedGender === o.id
                                                ? 'border-primary bg-primary/10'
                                                : 'border-border bg-card hover:border-primary/40'
                                        )}
                                    >
                                        <div className="text-2xl mb-1">{o.emoji}</div>
                                        <div className="text-sm font-medium">{o.label}</div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {step === 4 && (
                            <div className="space-y-4">
                                <div className="border-2 border-dashed border-primary/30 rounded-xl p-8 text-center bg-primary/5">
                                    <Shirt className="h-12 w-12 text-primary/40 mx-auto mb-3" />
                                    <p className="text-sm text-muted-foreground">You can upload your first item from the Virtual Closet page.</p>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3">
                            {step > 0 && (
                                <Button
                                    variant="ghost"
                                    className="flex-none text-muted-foreground"
                                    onClick={handleSkip}
                                >
                                    Skip
                                </Button>
                            )}
                            <Button
                                className="flex-1 h-11 gap-2"
                                onClick={handleNext}
                                disabled={!canAdvance() || isSaving}
                            >
                                {isSaving
                                    ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
                                    : isLast
                                        ? <><Shirt className="h-4 w-4" /> Go to My Closet</>
                                        : <>{step === 0 ? 'Get Started' : 'Continue'} <ArrowRight className="h-4 w-4" /></>
                                }
                            </Button>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Step counter */}
                <p className="text-center text-xs text-muted-foreground mt-4">
                    Step {step + 1} of {STEPS.length}
                </p>
            </div>
        </div>
    );
}
