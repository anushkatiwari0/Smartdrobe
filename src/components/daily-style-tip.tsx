'use client';

import { generateDailyStyleTip } from '@/ai/flows/daily-style-tip';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';

type CachedTip = {
  tip: string;
  date: string;
};

export default function DailyStyleTip() {
  const [tip, setTip] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTip = async () => {
      setLoading(true);
      setError('');
      try {
        const today = new Date().toISOString().split('T')[0];
        const cacheKey = 'dailyStyleTip';
        const cachedData = localStorage.getItem(cacheKey);

        if (cachedData) {
          try {
            const { tip: cachedTip, date }: CachedTip = JSON.parse(cachedData);
            if (date === today && cachedTip) {
              setTip(cachedTip);
              setLoading(false);
              return;
            }
          } catch (e) {
             localStorage.removeItem(cacheKey);
          }
        }

        const result = await generateDailyStyleTip();
        if (result && result.tip) {
          setTip(result.tip);
          localStorage.setItem(
            cacheKey,
            JSON.stringify({ tip: result.tip, date: today })
          );
        } else {
            throw new Error("Failed to generate a new style tip.");
        }
      } catch (e) {
        setError('Could not fetch a style tip today. Please try again later.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchTip();
  }, []);

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  return <p className="text-xl font-medium font-headline">{`"${tip}"`}</p>;
}
