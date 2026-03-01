'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const trendingOutfits = [
  {
    src: '/images/outfit_work.jpg',
    title: 'Executive Chic Blazer Set',
    price: '$129',
    rating: 4.9,
    reviews: 128,
    categoryTag: 'Workwear',
    aiMatch: '98% Match',
    href: '/lookbook',
    aiHint: 'professional woman outfit',
  },
  {
    src: '/images/outfit_casual.jpg',
    title: 'Weekend Comfort Knit',
    price: '$89',
    rating: 4.7,
    reviews: 84,
    categoryTag: 'Casual',
    aiMatch: '95% Match',
    href: '/what-to-wear',
    aiHint: 'woman street style',
  },
  {
    src: '/images/outfit_party.jpg',
    title: 'Midnight Silk Slip Dress',
    price: '$159',
    rating: 5.0,
    reviews: 210,
    categoryTag: 'Evening',
    aiMatch: '99% Match',
    href: '/lookbook',
    aiHint: 'woman party dress',
  },
  {
    src: '/images/outfit_daily.jpg',
    title: 'Urban Explorer Trench',
    price: '$149',
    rating: 4.8,
    reviews: 156,
    categoryTag: 'Seasonal',
    aiMatch: '94% Match',
    href: '/what-to-wear',
    aiHint: 'autumn fashion',
  },
];

export default function TrendingOutfitsSection() {
  return (
    <section id="trending" className="w-full py-16 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
          <div className="space-y-1 text-center md:text-left">
            <h2 className="text-3xl font-bold tracking-tight font-headline text-foreground">
              Trending Now
            </h2>
            <p className="text-muted-foreground">
              Curated looks tailored to your style profile.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {trendingOutfits.map((outfit, index) => (
            <div key={index} className="group cursor-pointer space-y-3">
              <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-muted">
                <Image unoptimized
                  src={outfit.src}
                  alt={outfit.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                  data-ai-hint={outfit.aiHint}
                />
                {/* Subtle gradient overlay on hover only */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
              </div>

              <div className="space-y-1 text-center">
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  {outfit.categoryTag}
                </p>
                <h3 className="font-headline text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                  {outfit.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
