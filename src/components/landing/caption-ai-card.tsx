'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Sparkles, Copy, RefreshCw, Upload } from "lucide-react";

export function CaptionAICard() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [captions, setCaptions] = useState<string[]>([]);
    const [selectedTone, setSelectedTone] = useState<string>('Trendy');
    const [hasImage, setHasImage] = useState(false);

    const tones = ['Trendy', 'Minimal', 'Bold', 'Elegant', 'Sustainable'];

    const handleGenerate = () => {
        setIsGenerating(true);
        // Mock API call
        setTimeout(() => {
            setCaptions([
                "Outfit on point, sustainable vibes only. 🌿✨ #EcoFashion",
                "Less is more. Elevating basics. 🤍 #MinimalStyle",
                "Confidence looks good on everyone. 💜"
            ]);
            setIsGenerating(false);
        }, 1500);
    };

    const handleUpload = () => {
        setHasImage(true);
    }

    return (
        <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-2 border-primary/20 shadow-md h-full flex flex-col">
            <CardHeader className="flex flex-row items-center gap-4 bg-primary/5 rounded-t-lg">
                <div className="bg-primary/20 p-3 rounded-full text-primary animate-pulse">
                    <Camera className="h-6 w-6" />
                </div>
                <div>
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                        CaptionAI <Badge variant="secondary" className="text-xs bg-secondary text-foreground">New</Badge>
                    </CardTitle>
                    <CardDescription>Instant AI captions for your OOTD.</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="pt-6 flex-1 flex flex-col space-y-4">

                {!hasImage ? (
                    <div
                        onClick={handleUpload}
                        className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors group"
                    >
                        <div className="bg-muted p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
                            <Upload className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">Click to upload outfit</p>
                    </div>
                ) : (
                    <div className="relative aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                        <p className="text-xs text-muted-foreground">Image Uploaded</p>
                        <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => setHasImage(false)}>X</Button>
                    </div>
                )}

                {hasImage && !captions.length && (
                    <div className="space-y-3">
                        <p className="text-xs font-semibold uppercase text-muted-foreground">Select Tone</p>
                        <div className="flex flex-wrap gap-2">
                            {tones.map(tone => (
                                <Badge
                                    key={tone}
                                    variant={selectedTone === tone ? "default" : "outline"}
                                    className={`cursor-pointer ${selectedTone === tone ? 'bg-secondary text-foreground hover:bg-secondary/80' : 'hover:bg-accent'}`}
                                    onClick={() => setSelectedTone(tone)}
                                >
                                    {tone}
                                </Badge>
                            ))}
                        </div>
                        <Button onClick={handleGenerate} disabled={isGenerating} className="w-full bg-primary text-white hover:bg-primary/90">
                            {isGenerating ? <Sparkles className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                            {isGenerating ? 'Magic in progress...' : 'Generate Captions'}
                        </Button>
                    </div>
                )}

                {captions.length > 0 && (
                    <div className="space-y-3 animate-fade-in-up">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold uppercase text-muted-foreground">AI Suggestions</p>
                            <Button variant="ghost" size="sm" onClick={handleGenerate} className="h-6 text-xs text-primary">
                                <RefreshCw className="mr-1 h-3 w-3" /> Regenerate
                            </Button>
                        </div>
                        <div className="bg-muted/30 rounded-md p-3 space-y-2 border">
                            {captions.map((caption, i) => (
                                <div key={i} className="flex items-start gap-2 group p-2 hover:bg-white rounded-md transition-colors">
                                    <p className="text-sm text-foreground flex-1 leading-snug">"{caption}"</p>
                                    <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Copy className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </CardContent>
        </Card>
    );
}
