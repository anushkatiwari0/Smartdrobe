
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTACard() {
  return (
    <section className="w-full py-12 md:py-16 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">Ready to Transform Your Wardrobe?</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Join the beta and experience the future of fashion. It’s smart, sustainable, and uniquely yours.
            </p>
          </div>
          <div className="space-x-4">
            <Button asChild size="lg" className="transition-transform hover:scale-105">
              <Link href="/dashboard">
                Start for Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
