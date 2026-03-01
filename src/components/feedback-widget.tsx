'use client';

import { useState } from 'react';
import { MessageSquarePlus, X, Star, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const RATINGS = [1, 2, 3, 4, 5];

export default function FeedbackWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const handleSubmit = async () => {
        if (!message.trim() && !rating) return;
        setIsSending(true);

        // Log as an analytics event (silent fail)
        try {
            await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event: 'page_view', // re-using closest event type
                    metadata: { type: 'feedback', rating, message: message.trim() },
                }),
            });
        } catch { /* silent */ }

        await new Promise(r => setTimeout(r, 600)); // show spinner briefly
        setIsSending(false);
        setIsDone(true);
        setTimeout(() => {
            setIsOpen(false);
            setIsDone(false);
            setRating(0);
            setMessage('');
        }, 2000);
    };

    return (
        <>
            {/* Floating button */}
            <div className="fixed bottom-6 right-6 z-50">
                {!isOpen && (
                    <Button
                        onClick={() => setIsOpen(true)}
                        size="sm"
                        className="rounded-full shadow-lg gap-2 bg-primary hover:bg-primary/90 transition-all hover:scale-105"
                    >
                        <MessageSquarePlus className="h-4 w-4" />
                        Feedback
                    </Button>
                )}
            </div>

            {/* Feedback panel */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 z-50 w-80 bg-card border border-border rounded-2xl shadow-2xl p-5 space-y-4 animate-in slide-in-from-bottom-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm">Share your feedback</h3>
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setIsOpen(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {isDone ? (
                        <div className="flex flex-col items-center py-6 gap-2">
                            <CheckCircle2 className="h-10 w-10 text-green-500" />
                            <p className="text-sm font-medium">Thanks for your feedback! 💜</p>
                        </div>
                    ) : (
                        <>
                            {/* Star rating */}
                            <div>
                                <p className="text-xs text-muted-foreground mb-2">How are you enjoying SmartDrobe?</p>
                                <div className="flex gap-1">
                                    {RATINGS.map(star => (
                                        <button
                                            key={star}
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHovered(star)}
                                            onMouseLeave={() => setHovered(0)}
                                            className="transition-transform hover:scale-110"
                                        >
                                            <Star
                                                className={cn(
                                                    'h-7 w-7 transition-colors',
                                                    (hovered || rating) >= star
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'text-muted-foreground'
                                                )}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Message */}
                            <div>
                                <p className="text-xs text-muted-foreground mb-2">Any suggestions or issues?</p>
                                <Textarea
                                    placeholder="Tell us what you think..."
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    className="min-h-[80px] text-sm resize-none"
                                />
                            </div>

                            {/* Submit */}
                            <Button
                                className="w-full"
                                size="sm"
                                onClick={handleSubmit}
                                disabled={isSending || (!rating && !message.trim())}
                            >
                                {isSending
                                    ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Sending...</>
                                    : <><Send className="h-4 w-4 mr-2" />Send Feedback</>
                                }
                            </Button>
                        </>
                    )}
                </div>
            )}
        </>
    );
}
