import WhatToWear from '@/components/what-to-wear';

export default function WhatToWearPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          What Should I Wear?
        </h1>
      </div>
      <p className="text-muted-foreground">
        See your upcoming outfits, or get instant suggestions from your virtual closet.
      </p>
      <WhatToWear />
    </div>
  );
}
