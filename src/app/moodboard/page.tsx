
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { generateBoardFromMood } from '@/ai/flows/generate-board-from-mood';
import { categorizeAndCaptionPin } from '@/ai/flows/categorize-and-caption-pin';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, Upload, Trash2, GripVertical } from 'lucide-react';

type Pin = {
  id: string;
  title: string;
  imageUrl: string;
  imagePrompt?: string;
  category?: string;
  caption?: string;
};

type Board = {
  id: string;
  name: string;
  pins: Pin[];
};

export default function MoodboardPage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [mood, setMood] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedBoards = localStorage.getItem('moodboards');
    if (savedBoards) {
      setBoards(JSON.parse(savedBoards));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('moodboards', JSON.stringify(boards));
  }, [boards]);

  const handleGenerateBoard = async () => {
    if (!mood) {
      toast({ title: 'Please enter a mood or theme.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      const result = await generateBoardFromMood({ mood });
      const newBoard: Board = {
        id: new Date().toISOString(),
        name: result.boardName,
        pins: result.pins.map((pin, index) => ({
          id: `${new Date().toISOString()}-${index}`,
          title: pin.title,
          imageUrl: pin.imageUrl,
          imagePrompt: pin.imagePrompt,
        })),
      };
      setBoards(prev => [newBoard, ...prev]);
      setMood('');
    } catch (error) {
      toast({ title: 'Failed to generate board.', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async (e) => {
      const photoDataUri = e.target?.result as string;
      try {
        const { category, caption } = await categorizeAndCaptionPin({ photoDataUri });
        const newPin: Pin = {
          id: new Date().toISOString(),
          title: caption,
          imageUrl: photoDataUri,
          category: category,
          caption: caption,
        };

        // Add to a "My Uploads" board or create one
        const uploadsBoardIndex = boards.findIndex(b => b.name === "My Uploads");
        if (uploadsBoardIndex > -1) {
          setBoards(prev => {
            const newBoards = [...prev];
            newBoards[uploadsBoardIndex].pins.unshift(newPin);
            return newBoards;
          })
        } else {
          const newBoard: Board = {
            id: "uploads-board",
            name: "My Uploads",
            pins: [newPin],
          };
          setBoards(prev => [newBoard, ...prev]);
        }
        toast({ title: "Image added!", description: `Categorized as ${category} and added to "My Uploads".` });
      } catch (error) {
        toast({ title: 'Failed to categorize image.', variant: 'destructive' });
      } finally {
        setIsUploading(false);
      }
    };
  };

  const deleteBoard = (boardId: string) => {
    setBoards(boards.filter(b => b.id !== boardId));
    toast({ title: "Board deleted." });
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Moodboards
        </h1>
      </div>
      <p className="text-muted-foreground">
        Create and explore visual moodboards for style inspiration.
      </p>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Enter a mood or theme (e.g., 'vintage parisian', '90s grunge')"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="flex-grow"
            />
            <Button onClick={handleGenerateBoard} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              Generate Board
            </Button>
            <Button asChild variant="outline">
              <label>
                {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                Upload Pin
                <input type="file" accept="image/*" className="sr-only" onChange={handleImageUpload} disabled={isUploading} />
              </label>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-8">
        {boards.map(board => (
          <div key={board.id} className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold font-headline">{board.name}</h2>
              <Button variant="ghost" size="sm" onClick={() => deleteBoard(board.id)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Board
              </Button>
            </div>
            <div id="board">
              {board.pins.map(pin => (
                <div key={pin.id} className="pin-card group relative">
                  <Image unoptimized src={pin.imageUrl} alt={pin.title} width={500} height={500} className="w-full h-auto rounded-lg" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end text-white rounded-lg">
                    <p className="font-bold">{pin.title}</p>
                    {pin.category && <p className="text-sm">{pin.category}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {boards.length === 0 && !isLoading && (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Your generated moodboards will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
