
import StyleCoach from '@/components/style-coach';
import { GraduationCap } from 'lucide-react';
import OutfitComparison from '@/components/outfit-comparison';
import { Separator } from '@/components/ui/separator';
import { Scale } from 'lucide-react';

export default function StyleCoachPage() {
  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      <div>
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            AI Style Coach
          </h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mt-2">
          Get instant, expert feedback on your look. Snap a photo of your outfit, tell us the occasion, and our AI will give you a score and personalized advice.
        </p>
      </div>
      <StyleCoach />

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
            <Scale className="h-8 w-8 text-primary" />
            Outfit Comparison
          </h1>
        </div>
        <p className="text-muted-foreground max-w-2xl">
          Can&apos;t decide what to wear? Put two outfits head-to-head and let our AI help you choose the winner.
        </p>
        <OutfitComparison />
      </div>

    </div>
  );
}
