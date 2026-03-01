import FitAdvisor from '@/components/fit-advisor';
import { Ruler } from 'lucide-react';

export default function FitAdvisorPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
          <Ruler className="h-8 w-8 text-primary" />
          Fit Advisor
        </h1>
      </div>
      <p className="text-muted-foreground">
        Tell us about your body shape and preferences to get personalized AI fit advice.
      </p>
      <FitAdvisor />
    </div>
  );
}
