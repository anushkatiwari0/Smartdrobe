'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section className="relative w-full h-screen min-h-[600px] flex items-center justify-center text-center text-white overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <Image unoptimized
          src="/aesthetic_wardrobe_dark_wide_4k.png"
          alt="A high-resolution, wide-angle, highly aesthetic digital wardrobe interior with elegantly arranged clothing on matte black racks in a sleek dark-themed room."
          fill
          className="object-cover object-center animate-zoom-in opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      </div>

      <motion.div
        className="relative z-10 container px-4 md:px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col justify-center space-y-4">
          <motion.h1
            className="text-5xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none font-headline drop-shadow-lg"
            variants={itemVariants}
          >
            SmartDrobe
          </motion.h1>
          <motion.p
            className="max-w-[600px] mx-auto text-lg md:text-xl text-white/90 drop-shadow-md"
            variants={itemVariants}
          >
            Your AI-powered virtual wardrobe assistant.
          </motion.p>
          <motion.div variants={itemVariants}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Button asChild size="lg" className="shadow-lg transition-transform hover:scale-105 active:scale-95">
                <Link href="/dashboard">
                  Explore Your Wardrobe <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
          <motion.div
            className="flex flex-col items-center justify-center space-y-2 mt-4"
            variants={itemVariants}
          >
            <div className="flex -space-x-4">
              <Image unoptimized className="inline-block h-10 w-10 rounded-full ring-2 ring-background" src="https://picsum.photos/seed/avatar1/100" alt="User 1" width={40} height={40} data-ai-hint="woman smiling" />
              <Image unoptimized className="inline-block h-10 w-10 rounded-full ring-2 ring-background" src="https://picsum.photos/seed/avatar2/100" alt="User 2" width={40} height={40} data-ai-hint="man with glasses" />
              <Image unoptimized className="inline-block h-10 w-10 rounded-full ring-2 ring-background" src="https://picsum.photos/seed/avatar3/100" alt="User 3" width={40} height={40} data-ai-hint="woman posing" />
              <Image unoptimized className="inline-block h-10 w-10 rounded-full ring-2 ring-background" src="https://picsum.photos/seed/avatar4/100" alt="User 4" width={40} height={40} data-ai-hint="man smiling" />
            </div>
            <p
              className="text-sm text-white/80 drop-shadow-md"
            >
              Used by 1000+ users
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
