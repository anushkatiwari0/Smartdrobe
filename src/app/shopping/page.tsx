import ShoppingAssistant from '@/components/shopping-assistant';

export default function ShoppingPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Smart Shopping Assistant
        </h1>
      </div>
      <p className="text-muted-foreground">
        Discover new items that complement your existing wardrobe, powered by AI.
      </p>
      <ShoppingAssistant />
    </div>
  );
}
