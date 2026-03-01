'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

type Outfit = {
  imageUrl: string;
  imageHint: string;
  description: string;
};

type DemoPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  outfit: Outfit | null;
};

export default function DemoPopup({ isOpen, onClose, outfit }: DemoPopupProps) {
  const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.2,
      },
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && outfit && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-md p-4"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the modal content
          >
            <Card className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="absolute -top-2 -right-2 z-10 h-8 w-8 rounded-full bg-secondary text-secondary-foreground"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
              <CardHeader>
                <CardTitle className="font-headline text-2xl text-center">AI Outfit Suggestion</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-square relative w-full overflow-hidden rounded-lg border">
                  <Image unoptimized
                    src={outfit.imageUrl}
                    alt="AI-generated outfit"
                    fill
                    className="object-cover"
                    data-ai-hint={outfit.imageHint}
                  />
                </div>
                <p className="text-center text-muted-foreground">
                  "{outfit.description}"
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
