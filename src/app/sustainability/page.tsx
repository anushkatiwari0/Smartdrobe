
import SustainabilityDashboard from '@/components/sustainability-tracker';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export default function SustainabilityPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-0.5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Wardrobe Carbon Footprint
          </h1>
          <p className="text-muted-foreground">
            Understand the environmental impact of your fashion choices.
          </p>
        </div>
      </div>
      <SustainabilityDashboard />
    </div>
  );
}
