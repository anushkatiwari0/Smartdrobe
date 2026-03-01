'use client';

import { useEffect, useState } from 'react';
import { getWeek } from 'date-fns';
import { Skeleton } from './ui/skeleton';

const challenges = [
  "Wear an outfit with a color you haven't used in a while.",
  "Create and schedule 3 new outfit combinations for this week in the calendar.",
  "Try mixing a formal piece (like a blazer) with a casual item (like jeans).",
  "Accessorize! Add at least three accessories to your outfit today.",
  "Build an outfit around your least-worn item in your closet.",
  "Go monochrome: Create an outfit using different shades of the same color.",
  "Plan your outfits for the next three days in the Outfit Calendar.",
];

export default function StyleChallengeCard() {
  const [challenge, setChallenge] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date();
    const currentWeek = getWeek(today);
    const year = today.getFullYear();
    const weekId = `${year}-w${currentWeek}`;
    
    let storedChallenge = localStorage.getItem('styleChallenge');
    let storedWeekId = localStorage.getItem('challengeWeekId');

    if (storedChallenge && storedWeekId === weekId) {
        setChallenge(storedChallenge);
    } else {
        const challengeIndex = (currentWeek + year) % challenges.length;
        const newChallenge = challenges[challengeIndex];
        setChallenge(newChallenge);
        localStorage.setItem('styleChallenge', newChallenge);
        localStorage.setItem('challengeWeekId', weekId);
    }
    
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  return (
    <p className="text-xl font-medium font-headline">{`"${challenge}"`}</p>
  );
}
