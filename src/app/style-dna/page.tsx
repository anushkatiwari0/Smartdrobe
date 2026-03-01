import StyleProfileAnalyzer from '@/components/style-profile-analyzer';
import { VenetianMask } from 'lucide-react';

export default function StyleDNAPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
          <VenetianMask className="h-8 w-8 text-primary" />
          Your Style DNA
        </h1>
      </div>
      <p className="text-muted-foreground">
        Discover your dominant style, color palette, and key pieces based on your wardrobe. Add at least 3 items to your closet to get started.
      </p>
      <StyleProfileAnalyzer />
    </div>
  );
}
