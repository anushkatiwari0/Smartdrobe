import LookbookGenerator from '@/components/lookbook-generator';

export default function LookbookPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          AI Lookbook Generator
        </h1>
      </div>
      <p className="text-muted-foreground">
        Select an occasion and let our AI stylist create some looks for you.
      </p>
      <LookbookGenerator />
    </div>
  );
}
