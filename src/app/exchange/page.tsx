import Image from 'next/image';
import { useCloset } from '@/hooks/use-closet-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Handshake } from 'lucide-react';
import ExchangeMarketplace from '@/components/exchange-marketplace';

export default function ExchangePage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
            <Handshake className="h-8 w-8" />
            Second-Hand Exchange
        </h1>
      </div>
      <p className="text-muted-foreground">
        Browse items listed for sale by the community. Give fashion a second life.
      </p>
      <ExchangeMarketplace />
    </div>
  );
}
