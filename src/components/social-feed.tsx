
'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Send, Heart, BarChart, FileImage, BadgeHelp, Upload, Sparkles, Wand2, Trash2, MoreHorizontal, ExternalLink, ThumbsUp, Scale, ShoppingBag, Camera } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

import { analyzePhotoPost } from '@/ai/flows/analyze-photo-post';
import { useToast } from '@/hooks/use-toast';
import type { FeedPost, AnalyzePhotoPostOutput, Poll, PollOption } from '@/lib/types';
import { useCloset } from '@/hooks/use-closet-store';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from './ui/skeleton';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';


const analyzeFormSchema = z.object({
  caption: z.string().optional(),
});

function PollOption({
  option,
  totalVotes,
  userVoted,
  onClick,
}: {
  option: PollOption,
  totalVotes: number,
  userVoted: boolean,
  onClick: () => void,
}) {
  const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
  return (
    <button
      onClick={onClick}
      disabled={userVoted}
      className={cn(
        "relative border-2 rounded-lg overflow-hidden w-full text-left group",
        userVoted ? 'border-primary' : 'border-dashed hover:border-solid hover:border-primary'
      )}
    >
      <div className="aspect-square relative">
        <Image unoptimized src={option.imageUrl} alt={option.description} fill className="object-cover transition-transform group-hover:scale-105" data-ai-hint={option.aiHint} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-2 left-2 text-white font-bold text-lg drop-shadow-md">
          {option.description}
        </div>
      </div>
      {userVoted && (
        <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
          <p className="text-4xl font-bold text-white drop-shadow-lg">{percentage.toFixed(0)}%</p>
        </div>
      )}
    </button>
  );
}

function PollComponent({ post }: { post: FeedPost }) {
  const { voteOnPoll } = useCloset();
  const poll = post.poll!;

  return (
    <div className="space-y-4">
      <p className="font-semibold text-center">{post.description}</p>
      <div className="grid grid-cols-2 gap-4">
        <PollOption
          option={poll.options[0]}
          totalVotes={poll.totalVotes}
          userVoted={!!poll.userVote}
          onClick={() => voteOnPoll(post.id, poll.options[0].id as 'A' | 'B')}
        />
        <PollOption
          option={poll.options[1]}
          totalVotes={poll.totalVotes}
          userVoted={!!poll.userVote}
          onClick={() => voteOnPoll(post.id, poll.options[1].id as 'A' | 'B')}
        />
      </div>
      {poll.userVote && <p className="text-sm text-center text-muted-foreground">{poll.totalVotes} total votes</p>}
    </div>
  );
}



export default function SocialFeed() {
  const { feedPosts, addFeedPost, removeFeedPost, likePost, addCommentToPost } = useCloset();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalyzePhotoPostOutput | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();


  const analyzeForm = useForm<z.infer<typeof analyzeFormSchema>>({
    resolver: zodResolver(analyzeFormSchema),
    defaultValues: { caption: '' },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoDataUri(e.target?.result as string);
        setAnalysisResult(null); // Clear previous analysis
      };
      reader.readAsDataURL(file);
    }
  };


  const onAnalyze = async (values: z.infer<typeof analyzeFormSchema>) => {
    if (!photoDataUri) {
      toast({ variant: 'destructive', title: 'No photo uploaded', description: 'Please upload a photo first.' });
      return;
    }
    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
      const result = await analyzePhotoPost({ photoDataUri, caption: values.caption });
      setAnalysisResult(result);
    } catch (error) {
      console.error('Failed to analyze photo:', error);
      toast({ variant: 'destructive', title: 'Analysis Failed', description: 'Could not analyze your photo.' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLike = (postId: string) => {
    likePost(postId);
  };


  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Card className="data-[animate=true]:animate-fade-in-down" data-animate>
        <CardHeader>
          <CardTitle className="font-headline">Generate a Caption</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-4 items-start">
            <div className="aspect-square relative bg-muted rounded-lg overflow-hidden border-2 border-dashed flex items-center justify-center">
              {photoDataUri ? (
                <Image unoptimized src={photoDataUri} alt="Your outfit" fill className="object-cover" />
              ) : (
                <div className="text-center text-muted-foreground p-4">
                  <Upload className="mx-auto h-12 w-12" />
                  <p className="mt-2 font-semibold">Upload your photo to post</p>
                </div>
              )}
            </div>
            <div className='space-y-4'>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/png, image/jpeg" onChange={handleImageUpload} />
              <Button onClick={() => fileInputRef.current?.click()} className="w-full" variant="outline">
                <Camera className="mr-2 h-4 w-4" /> {photoDataUri ? 'Change Photo' : 'Upload Photo'}
              </Button>
              <Form {...analyzeForm}>
                <form onSubmit={analyzeForm.handleSubmit(onAnalyze)} className="space-y-4">
                  <FormField
                    control={analyzeForm.control}
                    name="caption"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Caption idea (optional)</FormLabel>
                        <FormControl><Input placeholder="e.g., Feeling great today!" {...field} /></FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isAnalyzing || !photoDataUri} className="w-full">
                    {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Get Ideas
                  </Button>
                </form>
              </Form>
            </div>
          </div>
          {analysisResult && (
            <Card className="mt-4 bg-muted/50 animate-fade-in-up">
              <CardHeader>
                <CardTitle className="text-lg font-headline">AI Suggestions</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <h4 className="font-semibold text-sm">Generated Caption:</h4>
                  <p className="text-muted-foreground">"{analysisResult.caption}"</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Suggested Hashtags:</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {analysisResult.hashtags.map(tag => <Badge variant="secondary" key={tag}>#{tag}</Badge>)}
                  </div>
                </div>
                {analysisResult.upsellingSuggestion && (
                  <Alert>
                    <ShoppingBag className="h-4 w-4" />
                    <AlertTitle className="font-headline">Complete the Look</AlertTitle>
                    <AlertDescription>
                      {analysisResult.upsellingSuggestion}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>


    </div>
  );
}
