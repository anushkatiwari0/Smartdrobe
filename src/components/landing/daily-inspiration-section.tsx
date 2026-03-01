
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const dailyOutfits = [
    { day: 0, src: '/images/outfit_daily.jpg', tag: '#SundayBrunch', hint: 'woman brunch outfit' }, // Sunday
    { day: 1, src: '/images/outfit_work.jpg', tag: '#WorkwearChic', hint: 'woman office attire' }, // Monday
    { day: 2, src: '/images/outfit_casual.jpg', tag: '#StreetStyle', hint: 'woman street style' }, // Tuesday
    { day: 3, src: '/images/outfit_daily.jpg', tag: '#WellnessWednesday', hint: 'woman yoga outfit' }, // Wednesday
    { day: 4, src: '/images/outfit_party.jpg', tag: '#ThrowbackThursday', hint: 'vintage fashion style' }, // Thursday
    { day: 5, src: '/images/outfit_party.jpg', tag: '#FridayNightOut', hint: 'woman party dress' }, // Friday
    { day: 6, src: '/images/outfit_casual.jpg', tag: '#SaturdayVibes', hint: 'casual weekend fashion' }, // Saturday
];

export default function DailyInspirationSection() {
    const [outfit, setOutfit] = useState(dailyOutfits[0]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const currentDay = new Date().getDay();
        setOutfit(dailyOutfits[currentDay]);
        // Trigger fade-in animation
        setIsVisible(true);
    }, []);

    return (
        <section className="w-full h-[70vh] min-h-[500px] relative flex items-center justify-center text-center text-white overflow-hidden">
            <div
                key={outfit.src}
                className={cn(
                    "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                    isVisible ? 'opacity-100' : 'opacity-0'
                )}
            >
                <Image unoptimized
                    src={outfit.src}
                    alt={`Outfit of the day: ${outfit.tag}`}
                    fill
                    className="object-cover object-center"
                    data-ai-hint={outfit.hint}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
            </div>

            <div className="relative z-10 p-4 space-y-6">
                <div
                    className={cn(
                        "transition-all duration-1000 ease-in-out",
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    )}
                >
                    <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline drop-shadow-lg">
                        Outfit of the Day
                    </h2>
                    <p className="mt-4 text-lg md:text-xl text-white/90 drop-shadow-md">
                        Fresh inspiration, served daily by our AI stylist.
                    </p>
                </div>
                <div
                    className={cn(
                        "transition-all duration-1000 ease-in-out delay-300",
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    )}
                >
                    <Badge variant="secondary" className="text-base py-2 px-4 shadow-lg">
                        {outfit.tag}
                    </Badge>
                </div>
                <div
                    className={cn(
                        "transition-all duration-1000 ease-in-out delay-500",
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    )}
                >
                    <Button asChild size="lg" className="mt-4 transition-transform hover:scale-105 shadow-xl">
                        <Link href="/what-to-wear">
                            Get My Look <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
