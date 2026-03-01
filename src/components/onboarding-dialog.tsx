
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Shirt, Search, CalendarPlus, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
    {
        icon: Sparkles,
        title: "Welcome to SmartDrobe",
        description: "Upload your clothes, let AI organize them, and instantly get daily outfit recommendations tailored to you.",
        cta: "Let's Go",
    },
    {
        icon: Shirt,
        title: "Add Your Clothes",
        description: "Upload outfits from Gallery or snap photos with Camera.",
        cta: "Start Uploading",
    },
    {
        icon: Search,
        title: "Organize & Filter",
        description: "Easily filter by clothing type and color to find your pieces faster.",
        cta: "Try Filters",
    },
    {
        icon: CalendarPlus,
        title: "Create & Plan Outfits",
        description: "Mix and match items, save combinations, and add them to your calendar.",
        cta: "Start Building My Closet",
    },
];

type OnboardingDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function OnboardingDialog({ open, onOpenChange }: OnboardingDialogProps) {
    const [step, setStep] = useState(0);

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            onOpenChange(false);
        }
    };

    const handleClose = () => {
        onOpenChange(false);
    };

    const currentStep = steps[step];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden shadow-2xl">
                <DialogTitle className="sr-only">Welcome to SmartDrobe</DialogTitle>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="p-8 text-center"
                    >
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
                            <currentStep.icon className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold font-headline mb-2">{currentStep.title}</h3>
                        <p className="text-muted-foreground mb-8">{currentStep.description}</p>
                    </motion.div>
                </AnimatePresence>

                <div className="p-6 bg-muted/50">
                    <Button onClick={handleNext} className="w-full">
                        {step === steps.length - 1 ? "Done" : "Next"}
                    </Button>

                    <div className="flex justify-center gap-2 mt-4">
                        {steps.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setStep(i)}
                                className={cn(
                                    "h-2 w-2 rounded-full transition-all",
                                    i === step ? "w-6 bg-primary" : "bg-primary/20 hover:bg-primary/40"
                                )}
                            />
                        ))}
                    </div>
                </div>

                <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={handleClose}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </Button>
            </DialogContent>
        </Dialog>
    );
}
