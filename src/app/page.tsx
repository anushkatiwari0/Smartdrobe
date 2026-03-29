
'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import HeroSection from '@/components/landing/hero-section';
import OnboardingDialog from '@/components/onboarding-dialog';

// Lazy load non-critical components for better initial load
const CTACard = lazy(() => import('@/components/landing/cta-card'));
const DailyInspirationSection = lazy(() => import('@/components/landing/daily-inspiration-section'));
const FeaturesSection = lazy(() => import('@/components/landing/features-section'));
const Footer = lazy(() => import('@/components/landing/footer'));
const InsightsPreviewSection = lazy(() => import('@/components/landing/insights-preview-section'));
const HowItWorksSection = lazy(() => import('@/components/landing/how-it-works-section'));
const TestimonialsSection = lazy(() => import('@/components/landing/testimonials-section'));
const TrendingOutfitsSection = lazy(() => import('@/components/landing/trending-outfits-section'));
const FashionQuiz = lazy(() => import('@/components/landing/fashion-quiz'));

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" }
};

export default function LandingPage() {
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  useEffect(() => {
    // Always show onboarding when landing on home page
    setIsOnboardingOpen(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <OnboardingDialog open={isOnboardingOpen} onOpenChange={setIsOnboardingOpen} />
      <header className="px-4 lg:px-6 h-16 flex items-center bg-background/95 backdrop-blur-sm sticky top-0 z-50 border-b">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <Logo />
          <span className="font-headline text-xl ml-2 font-bold tracking-tight">SmartDrobe</span>
        </Link>
        <nav className="ml-auto hidden md:flex items-center gap-4 sm:gap-6">
          <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors" prefetch={false}>
            Features
          </Link>
          <Link href="#showcase" className="text-sm font-medium hover:text-primary transition-colors" prefetch={false}>
            Showcase
          </Link>
          <Button asChild variant="ghost" className="text-sm font-medium">
            <Link href="/auth/login">Sign In</Link>
          </Button>
          <Button asChild className="bg-primary hover:bg-primary/90 text-white shadow-md">
            <Link href="/auth/signup">Get Started Free</Link>
          </Button>
        </nav>
        <div className="ml-auto md:hidden">
          <Button asChild size="sm" className="bg-primary text-white">
            <Link href="/auth/signup">Get Started</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <motion.div {...fadeInUp}>
          <HeroSection />
        </motion.div>

        <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>}>
          <InsightsPreviewSection />

          <motion.div {...fadeInUp}>
            <HowItWorksSection />
          </motion.div>

          <motion.div {...fadeInUp}>
            <FeaturesSection />
          </motion.div>

          <motion.div {...fadeInUp}>
            <TestimonialsSection />
          </motion.div>

          <motion.div {...fadeInUp}>
            <TrendingOutfitsSection />
          </motion.div>

          <motion.div {...fadeInUp}>
            <DailyInspirationSection />
          </motion.div>

          <motion.div {...fadeInUp}>
            <FashionQuiz />
          </motion.div>

          <motion.div {...fadeInUp}>
            <CTACard />
          </motion.div>
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}
