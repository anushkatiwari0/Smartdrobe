'use client';

import { useEffect, useState } from 'react';
import DailyStyleTip from '@/components/daily-style-tip';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Shirt, ArrowRight, Trophy, Leaf } from 'lucide-react';
import Link from 'next/link';
import StyleChallengeCard from '@/components/style-challenge-card';
import FashionStatsSection from '@/components/landing/fashion-stats-section';
import OnboardingFlow from '@/components/onboarding-flow';
import { useAuth } from '@/hooks/use-auth';
import { createClient } from '@/lib/supabase/client';

const featureCards = [
  {
    icon: Shirt,
    title: 'Virtual Closet',
    description: 'Add and manage your clothing items with AI-generated images.',
    href: '/closet',
    cta: 'Go to Closet',
  },
  {
    icon: Sparkles,
    title: 'What to Wear?',
    description: 'Get instant outfit suggestions based on your mood and the weather.',
    href: '/what-to-wear',
    cta: 'Style Me',
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const animate = true;

  /**
   * 'loading' — profile check in-flight; block OnboardingFlow render (prevents flicker)
   * 'show'    — Supabase confirmed onboarding_completed = false/null → new user
   * 'hide'    — Supabase confirmed onboarding_completed = true  → returning user
   */
  const [onboardingState, setOnboardingState] = useState<'loading' | 'show' | 'hide'>('loading');

  useEffect(() => {
    // user is undefined while auth is initializing — wait silently
    if (user === undefined) return;
    // user is null → not logged in; middleware will redirect
    if (user === null) { setOnboardingState('hide'); return; }

    const checkProfile = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single();
      // Show onboarding if column is false/null OR query failed
      setOnboardingState(error || !data?.onboarding_completed ? 'show' : 'hide');
    };

    checkProfile();
  }, [user]);

  return (
    <>
      {/* Only rendered after profile check resolves — zero flicker */}
      {onboardingState === 'show' && (
        <OnboardingFlow onComplete={() => setOnboardingState('hide')} />
      )}

      <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
        <div className="space-y-2">
          <h1
            className="text-3xl font-bold tracking-tight font-headline data-[animate=true]:animate-fade-in-down"
            data-animate={animate}
          >
            Welcome to SmartDrobe
          </h1>
          <p
            className="text-muted-foreground data-[animate=true]:animate-fade-in-down"
            style={{ animationDelay: '0.2s' }}
            data-animate={animate}
          >
            Your AI-powered virtual wardrobe assistant.
          </p>
        </div>

        {/* Section 1: Tips & Inspiration */}
        <div
          className="space-y-4 pt-6 data-[animate=true]:animate-fade-in-up"
          data-animate={animate}
          style={{ animationDelay: '0.3s' }}
        >
          <h2 className="text-2xl font-bold font-headline tracking-tight">Tips &amp; Inspiration</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="transition-shadow hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Daily Style Tip</CardTitle>
                <Sparkles className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><DailyStyleTip /></CardContent>
            </Card>

            <Card className="transition-shadow hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Weekly Style Challenge</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><StyleChallengeCard /></CardContent>
            </Card>
          </div>
        </div>

        {/* Section 2: Style DNA */}
        <div
          className="space-y-4 data-[animate=true]:animate-fade-in-up"
          data-animate={animate}
          style={{ animationDelay: '0.5s' }}
        >
          <FashionStatsSection />
        </div>

        {/* Section 3: Sustainability */}
        <div
          className="space-y-4 data-[animate=true]:animate-fade-in-up"
          data-animate={animate}
          style={{ animationDelay: '0.7s' }}
        >
          <h2 className="text-2xl font-bold font-headline tracking-tight">Sustainability Insights</h2>
          <Card className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2">
                <Leaf className="h-5 w-5 text-primary" /> Wardrobe Footprint
              </CardTitle>
              <CardDescription>
                Track the environmental impact of your wardrobe and learn how to make more sustainable choices.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full sm:w-auto transition-transform hover:scale-105 active:scale-95" variant="secondary">
                <Link href="/sustainability">
                  View Sustainability Report <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Section 4: Explore More Features */}
        <div
          className="space-y-4 data-[animate=true]:animate-fade-in-up"
          data-animate={animate}
          style={{ animationDelay: '0.9s' }}
        >
          <h2 className="text-2xl font-bold font-headline tracking-tight">Explore More Features</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {featureCards.map((feature) => (
              <Card key={feature.href} className="flex flex-col transition-transform hover:-translate-y-1 hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
                <CardContent>
                  <Button asChild className="w-full transition-transform hover:scale-105 active:scale-95">
                    <Link href={feature.href}>
                      {feature.cta} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
