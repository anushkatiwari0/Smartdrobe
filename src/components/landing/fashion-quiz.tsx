
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, ArrowRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';


type StyleType = 'Casual Comfort' | 'Modern Chic' | 'Timeless Elegant';

const quizQuestions = [
  {
    question: "Your ideal weekend involves:",
    answers: [
      { text: "A relaxing day at home or a casual walk in the park.", style: 'Casual Comfort' },
      { text: "Trying a new trendy brunch spot and shopping.", style: 'Modern Chic' },
      { text: "Visiting an art gallery or attending a concert.", style: 'Timeless Elegant' },
    ],
  },
  {
    question: "Pick a color palette:",
    answers: [
      { text: "Neutrals: beige, gray, and denim blue.", style: 'Casual Comfort' },
      { text: "Bold & Contrasting: black, white, and a pop of color.", style: 'Modern Chic' },
      { text: "Rich & Muted: navy, burgundy, and cream.", style: 'Timeless Elegant' },
    ],
  },
  {
    question: "Your go-to shoes are:",
    answers: [
      { text: "Comfortable sneakers or flat sandals.", style: 'Casual Comfort' },
      { text: "Stylish ankle boots or statement heels.", style: 'Modern Chic' },
      { text: "Classic loafers or pointed-toe flats.", style: 'Timeless Elegant' },
    ],
  },
  {
    question: "Choose an accessory:",
    answers: [
      { text: "A simple tote bag or a backpack.", style: 'Casual Comfort' },
      { text: "A structured, trendy handbag.", style: 'Modern Chic' },
      { text: "A delicate gold necklace or a silk scarf.", style: 'Timeless Elegant' },
    ],
  },
  {
    question: "Your favorite fabric is:",
    answers: [
      { text: "Soft cotton or cozy knits.", style: 'Casual Comfort' },
      { text: "Leather or structured denim.", style: 'Modern Chic' },
      { text: "Silk, satin, or fine wool.", style: 'Timeless Elegant' },
    ],
  },
];

const styleResults: Record<StyleType, { description: string, image: string, hint: string }> = {
  'Casual Comfort': {
    description: "You value comfort and practicality. Your style is relaxed, effortless, and perfect for everyday life.",
    image: '/images/outfit_casual.jpg',
    hint: 'casual fashion style'
  },
  'Modern Chic': {
    description: "You love keeping up with trends and expressing yourself with bold, contemporary pieces. Your style is sharp and fashionable.",
    image: '/images/outfit_work.jpg',
    hint: 'chic fashion style'
  },
  'Timeless Elegant': {
    description: "You appreciate classic silhouettes, quality fabrics, and a polished look. Your style is sophisticated and refined.",
    image: '/images/outfit_party.jpg',
    hint: 'elegant fashion style'
  }
}


export default function FashionQuiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<StyleType[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const progress = (currentQuestionIndex / quizQuestions.length) * 100;

  const handleAnswerClick = (style: StyleType) => {
    const newAnswers = [...answers, style];
    setAnswers(newAnswers);

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const getResult = (): StyleType => {
    if (answers.length === 0) return 'Casual Comfort';
    const counts: Record<string, number> = {};
    answers.forEach(answer => {
      counts[answer] = (counts[answer] || 0) + 1;
    });
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b) as StyleType;
  }

  const result = getResult();

  return (
    <section className="w-full py-12 md:py-16 bg-background">
      <div className="container px-4 md:px-6">
        <Card className="max-w-3xl mx-auto shadow-lg">
          {!quizCompleted ? (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold tracking-tighter font-headline">What's Your Style Personality?</CardTitle>
                <CardDescription>Answer a few questions to find your unique style.</CardDescription>
                <Progress value={progress} className="w-full mt-4" />
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                <div key={currentQuestionIndex} className="animate-fade-in text-center">
                  <h3 className="text-xl md:text-2xl font-semibold mb-6">{quizQuestions[currentQuestionIndex].question}</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {quizQuestions[currentQuestionIndex].answers.map((answer, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="lg"
                        className="justify-start h-auto py-4 text-left transition-transform hover:scale-105"
                        onClick={() => handleAnswerClick(answer.style as StyleType)}
                      >
                        {answer.text}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <div className="animate-fade-in pb-6">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-4xl font-bold tracking-tight font-headline text-primary">Your Style Is: {result}</CardTitle>
                <CardDescription className="text-lg text-foreground font-medium pt-2">{styleResults[result].description}</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                {/* Commercial Grid Layout for Result */}
                <div className="flex justify-center mb-8">
                  <div className="relative aspect-[3/4] w-full max-w-sm rounded-lg overflow-hidden shadow-md group">
                    <Image unoptimized
                      src={styleResults[result].image}
                      alt={`Main look for ${result}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      data-ai-hint={styleResults[result].hint}
                    />
                    <div className="absolute top-2 right-2 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm">
                      Signature Look
                    </div>
                  </div>
                </div>

                <div className="space-y-4 text-center max-w-md mx-auto">
                  <p className="font-semibold text-muted-foreground">We've curated a collection that matches your {result.toLowerCase()} vibe.</p>
                </div>
              </CardContent>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}
