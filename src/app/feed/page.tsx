
import SocialFeed from '@/components/social-feed';
import { Captions } from 'lucide-react';

export default function FeedPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
            <Captions className="h-8 w-8 text-primary" />
            CaptionAI – Smart captions for every look.
        </h1>
      </div>
      <p className="text-muted-foreground">
        Upload a photo of your outfit to get instant, AI-powered caption and hashtag ideas.
      </p>
      <SocialFeed />
    </div>
  );
}
