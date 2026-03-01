
'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Shirt, TrendingUp, AlertCircle, Sparkles, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: "easeOut" }
};

export default function InsightsPreviewSection() {
    return (
        <section className="w-full py-24 bg-black text-white overflow-hidden relative">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-[100px]" />
            </div>

            <div className="container px-4 md:px-6 relative z-10">
                <motion.div
                    className="text-center mb-16 space-y-4"
                    {...fadeInUp}
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-xs font-medium tracking-widest text-white/70 uppercase">
                        Smart Analytics
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight font-headline">
                        Unlock Your Wardrobe's Potential
                    </h2>
                    <p className="text-white/60 max-w-2xl mx-auto text-lg">
                        Get personalized insights, track your wearing habits, and maximize the versatility of every item you own.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">

                    {/* Health Score Card */}
                    <motion.div
                        {...fadeInUp}
                        transition={{ delay: 0.1 }}
                        className="col-span-1 lg:col-span-1"
                    >
                        <Card className="h-full bg-white/5 border-white/10 backdrop-blur-md text-white hover:bg-white/10 transition-colors">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-emerald-400" />
                                    Closet Health Score
                                </CardTitle>
                                <CardDescription className="text-white/50">Overall wardrobe efficiency</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center py-6">
                                <div className="relative h-32 w-32 flex items-center justify-center">
                                    {/* Ring SVG */}
                                    <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                                        <path className="text-white/10" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                        <path className="text-emerald-400" strokeDasharray="85, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                    </svg>
                                    <div className="absolute flex flex-col items-center">
                                        <span className="text-3xl font-bold">85</span>
                                        <span className="text-xs text-white/50">Excellent</span>
                                    </div>
                                </div>
                                <p className="mt-4 text-sm text-center text-white/70">
                                    Your wardrobe is highly versatile. Great job mixing and matching!
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Usage Stats - Most Worn / Least Used */}
                    <motion.div
                        {...fadeInUp}
                        transition={{ delay: 0.2 }}
                        className="col-span-1 lg:col-span-1 flex flex-col gap-6"
                    >
                        {/* Most Worn */}
                        <Card className="flex-1 bg-white/5 border-white/10 backdrop-blur-md text-white hover:bg-white/10 transition-colors">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-purple-400" /> Most Worn Item
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex items-center gap-4">
                                <div className="relative h-16 w-16 rounded-md overflow-hidden bg-white/5">
                                    <Image unoptimized
                                        src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=200&q=80"
                                        alt="White Tee"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="font-medium">Classic White Tee</p>
                                    <p className="text-xs text-white/50">Worn 12 times this month</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Least Used */}
                        <Card className="flex-1 bg-white/5 border-white/10 backdrop-blur-md text-white hover:bg-white/10 transition-colors">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4 text-orange-400" /> Least Used Item
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex items-center gap-4">
                                <div className="relative h-16 w-16 rounded-md overflow-hidden bg-white/5">
                                    <Image unoptimized
                                        src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=200&q=80"
                                        alt="Blazer"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="font-medium">Black Blazer</p>
                                    <p className="text-xs text-white/50">Last worn 3 months ago</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Smart Recommendation & Versatility */}
                    <motion.div
                        {...fadeInUp}
                        transition={{ delay: 0.3 }}
                        className="col-span-1 lg:col-span-1 flex flex-col gap-6"
                    >
                        {/* Versatility Meter */}
                        <Card className="bg-white/5 border-white/10 backdrop-blur-md text-white hover:bg-white/10 transition-colors">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-yellow-400" /> Outfit Versatility
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span>Casual</span>
                                        <span>90%</span>
                                    </div>
                                    <Progress value={90} className="h-2 bg-white/10" indicatorClassName="bg-yellow-400" />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span>Formal</span>
                                        <span>45%</span>
                                    </div>
                                    <Progress value={45} className="h-2 bg-white/10" indicatorClassName="bg-purple-400" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recommendation */}
                        <Card className="flex-1 bg-gradient-to-br from-purple-900/40 to-black border-white/10 backdrop-blur-md text-white">
                            <CardHeader>
                                <CardTitle className="text-sm font-medium text-purple-200">AI Recommendation</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-white/80 leading-relaxed">
                                    "Your wardrobe lacks <strong>neutral bottoms</strong>. Adding beige chinos could unlock <strong>15+ new outfits</strong>."
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
