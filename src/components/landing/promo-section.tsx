
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';
import DemoPopup from './demo-popup';

const sampleOutfit = {
    imageUrl: 'https://picsum.photos/seed/promopopup/600/600',
    imageHint: 'stylish runway model',
    description: 'This AI-generated look combines a classic silhouette with a modern, edgy twist, perfect for making a statement.',
};

export default function PromoSection() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const animate = true;

    return (
        <>
            <section className="relative w-full py-20 md:py-24 lg:py-32 flex items-center justify-center text-center text-white overflow-hidden bg-black">
                <div className="absolute inset-0 z-0">
                    <Image unoptimized
                        src="/images/promo_background.jpg"
                        alt="A stylish flatlay of modern clothing items (shirt, jeans, accessories) on a minimalist background."
                        fill
                        className="object-cover object-center animate-zoom-in opacity-70"
                        data-ai-hint="clothing flat lay"
                    />
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                </div>

                <div className="relative z-10 p-4 space-y-6">
                    <div
                        className={cn(
                            "transition-all duration-1000 ease-in-out data-[animate=true]:animate-fade-in-up",
                            animate && "animate-fade-in-up"
                        )}
                    >
                        <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline drop-shadow-lg">
                            See Your Wardrobe in a New Light
                        </h2>
                        <p className="mt-4 text-lg md:text-xl text-white/90 drop-shadow-md max-w-2xl mx-auto">
                            Upload a photo of your clothes, and let our AI organize and style them for you.
                        </p>
                    </div>

                    <div
                        className={cn(
                            "transition-all duration-1000 ease-in-out delay-300 data-[animate=true]:animate-fade-in-up",
                            animate && "animate-fade-in-up"
                        )}
                    >
                        <Button
                            size="lg"
                            className="transition-transform hover:scale-105 active:scale-95 shadow-xl"
                            asChild
                        >
                            <Link href="/closet">
                                <UploadCloud className="mr-2 h-5 w-5" />
                                Upload Your Outfit
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </>
    );
}
