'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useCloset } from '@/hooks/use-closet-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, User, MapPin, Palette, Tag, Star } from 'lucide-react';

const STYLE_OPTIONS = ['Casual', 'Minimalist', 'Streetwear', 'Formal', 'Bohemian', 'Preppy', 'Athleisure', 'Vintage', 'Y2K', 'Cottagecore'];
const OCCASION_OPTIONS = ['Everyday', 'Work', 'Date Night', 'Party', 'Travel', 'Gym', 'Formal Events', 'Brunch'];
const COLOR_OPTIONS = ['Black', 'White', 'Navy', 'Beige', 'Grey', 'Brown', 'Olive', 'Burgundy', 'Pink', 'Blue', 'Green', 'Red'];

export default function ProfilePage() {
    const { user } = useAuth();
    const { closetItems, userOutfits } = useCloset();
    const { toast } = useToast();

    const [displayName, setDisplayName] = useState('');
    const [city, setCity] = useState('');
    const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
    const [favColors, setFavColors] = useState<string[]>([]);
    const [avoidColors, setAvoidColors] = useState<string[]>([]);
    const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!user) return;
        setDisplayName(user.user_metadata?.display_name || '');

        const load = async () => {
            try {
                const res = await fetch('/api/user/preferences');
                if (res.ok) {
                    const { preferences } = await res.json();
                    if (preferences) {
                        setSelectedStyles(preferences.style_keywords || []);
                        setFavColors(preferences.fav_colors || []);
                        setAvoidColors(preferences.avoid_colors || []);
                        setSelectedOccasions(preferences.occasions || []);
                    }
                }
                // Also fetch profile for city
                const { createClient } = await import('@/lib/supabase/client');
                const supabase = createClient();
                const { data } = await supabase.from('profiles').select('location_city, display_name').eq('id', user.id).single();
                if (data) {
                    if (data.location_city) setCity(data.location_city);
                    if (data.display_name) setDisplayName(data.display_name);
                }
            } catch (e) { console.error(e); }
            finally { setIsLoading(false); }
        };
        load();
    }, [user]);

    const toggle = (arr: string[], val: string, setter: (v: string[]) => void) => {
        setter(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/user/preferences', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    display_name: displayName,
                    location_city: city,
                    style_keywords: selectedStyles,
                    fav_colors: favColors,
                    avoid_colors: avoidColors,
                    occasions: selectedOccasions,
                }),
            });
            if (res.ok) {
                toast({ title: 'Profile saved!', description: 'Your preferences have been updated.' });
            } else {
                toast({ title: 'Error saving profile', variant: 'destructive' });
            }
        } catch {
            toast({ title: 'Network error', variant: 'destructive' });
        } finally {
            setIsSaving(false);
        }
    };

    const mostWornItem = closetItems.slice().sort((a, b) => (b.wearCount || 0) - (a.wearCount || 0))[0];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 pb-12">
            <div>
                <h1 className="text-2xl font-bold font-headline">Profile & Preferences</h1>
                <p className="text-muted-foreground text-sm mt-1">Customize how SmartDrobe recommends outfits for you.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Wardrobe Items', value: closetItems.length, icon: '👗' },
                    { label: 'Saved Outfits', value: userOutfits.length, icon: '✨' },
                    { label: 'Most Worn', value: mostWornItem?.name?.split(' ')[0] || '—', icon: '🏆' },
                ].map(stat => (
                    <div key={stat.label} className="bg-card border border-border/60 rounded-xl p-4 text-center">
                        <div className="text-2xl mb-1">{stat.icon}</div>
                        <div className="text-xl font-bold">{stat.value}</div>
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                ))}
            </div>

            <Separator />

            {/* Account Info */}
            <div className="space-y-4">
                <h2 className="font-semibold flex items-center gap-2"><User className="h-4 w-4 text-primary" /> Account</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                        <Label>Display Name</Label>
                        <Input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Your name" />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Email</Label>
                        <Input value={user?.email || ''} disabled className="bg-muted" />
                    </div>
                </div>
            </div>

            <Separator />

            {/* Location */}
            <div className="space-y-3">
                <h2 className="font-semibold flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Location</h2>
                <p className="text-sm text-muted-foreground">Used for weather-aware outfit recommendations.</p>
                <Input value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Mumbai, London, New York" className="max-w-xs" />
            </div>

            <Separator />

            {/* Style Keywords */}
            <div className="space-y-3">
                <h2 className="font-semibold flex items-center gap-2"><Star className="h-4 w-4 text-primary" /> Your Style</h2>
                <p className="text-sm text-muted-foreground">Select styles that match your aesthetic (pick up to 5).</p>
                <div className="flex flex-wrap gap-2">
                    {STYLE_OPTIONS.map(s => (
                        <Badge
                            key={s}
                            variant={selectedStyles.includes(s) ? 'default' : 'outline'}
                            className="cursor-pointer select-none transition-all hover:scale-105"
                            onClick={() => toggle(selectedStyles, s, setSelectedStyles)}
                        >
                            {s}
                        </Badge>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Occasions */}
            <div className="space-y-3">
                <h2 className="font-semibold flex items-center gap-2"><Tag className="h-4 w-4 text-primary" /> Occasions</h2>
                <p className="text-sm text-muted-foreground">What do you usually dress for?</p>
                <div className="flex flex-wrap gap-2">
                    {OCCASION_OPTIONS.map(o => (
                        <Badge
                            key={o}
                            variant={selectedOccasions.includes(o) ? 'default' : 'outline'}
                            className="cursor-pointer select-none transition-all hover:scale-105"
                            onClick={() => toggle(selectedOccasions, o, setSelectedOccasions)}
                        >
                            {o}
                        </Badge>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Favorite Colors */}
            <div className="space-y-3">
                <h2 className="font-semibold flex items-center gap-2"><Palette className="h-4 w-4 text-primary" /> Favorite Colors</h2>
                <div className="flex flex-wrap gap-2">
                    {COLOR_OPTIONS.map(c => (
                        <Badge
                            key={c}
                            variant={favColors.includes(c) ? 'default' : 'outline'}
                            className="cursor-pointer select-none transition-all hover:scale-105"
                            onClick={() => toggle(favColors, c, setFavColors)}
                        >
                            {c}
                        </Badge>
                    ))}
                </div>

                {/* Colors to avoid */}
                <p className="text-sm text-muted-foreground pt-2">Colors to avoid in recommendations:</p>
                <div className="flex flex-wrap gap-2">
                    {COLOR_OPTIONS.map(c => (
                        <Badge
                            key={c}
                            variant={avoidColors.includes(c) ? 'destructive' : 'outline'}
                            className="cursor-pointer select-none transition-all hover:scale-105"
                            onClick={() => toggle(avoidColors, c, setAvoidColors)}
                        >
                            {c}
                        </Badge>
                    ))}
                </div>
            </div>

            <div className="pt-2">
                <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto h-11 px-8">
                    {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…</> : <><Save className="mr-2 h-4 w-4" /> Save Preferences</>}
                </Button>
            </div>
        </div>
    );
}
