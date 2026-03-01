
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Calendar,
    Captions,
    GraduationCap,
    LayoutGrid,
    Luggage,
    PanelLeft,
    Ruler,
    Shirt,
    WandSparkles,
    LogOut,
    User,
    ChevronDown,
} from 'lucide-react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '../theme-toggle';
import { useAuth } from '@/hooks/use-auth';
import FeedbackWidget from '@/components/feedback-widget';


const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
    { href: '/closet', label: 'Virtual Closet', icon: Shirt },
    { href: '/what-to-wear', label: 'What to Wear?', icon: WandSparkles },
    { href: '/style-coach', label: 'Style Coach', icon: GraduationCap },
];

const otherNavItems = [
    { href: '/travel-planner', label: 'Travel Planner', icon: Luggage },
    { href: '/calendar', label: 'Outfit Calendar', icon: Calendar },
    { href: '/fit-advisor', label: 'Fit Advisor', icon: Ruler },
    { href: '/feed', label: 'CaptionAI', icon: Captions },
];

const NavContent = ({ onLinkClick }: { onLinkClick?: () => void }) => {
    const pathname = usePathname();
    const { user, signOut } = useAuth();
    const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'User';
    const initials = displayName.slice(0, 2).toUpperCase();

    const handleLinkClick = () => {
        if (onLinkClick) onLinkClick();
    };

    return (
        <div className="flex flex-col h-full bg-card text-card-foreground">
            <div className="flex items-center justify-between p-4 mb-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="shrink-0 text-primary hover:bg-primary/10 hover:text-primary-foreground" asChild>
                        <Link href="/">
                            <Logo />
                            <span className="sr-only">SmartDrobe</span>
                        </Link>
                    </Button>
                    <h2 className="text-xl font-bold font-headline tracking-tight text-primary">
                        SmartDrobe
                    </h2>
                </div>
                <ThemeToggle />
            </div>
            <nav className="flex-1 overflow-y-auto px-3 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Button
                            key={item.href}
                            asChild
                            variant="ghost"
                            className={`w-full justify-start text-base font-medium h-12 transition-all duration-200 ${isActive
                                ? 'bg-primary/10 text-primary shadow-sm hover:bg-primary/15'
                                : 'text-muted-foreground hover:bg-primary/5 hover:text-primary hover:translate-x-1'
                                }`}
                        >
                            <Link href={item.href} onClick={handleLinkClick}>
                                <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-primary' : ''}`} />
                                <span>{item.label}</span>
                                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                            </Link>
                        </Button>
                    );
                })}

                <div className="pt-4 mt-4 border-t border-border/40">
                    <p className="px-4 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Explore</p>
                    {otherNavItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Button
                                key={item.href}
                                asChild
                                variant="ghost"
                                className={`w-full justify-start text-base font-medium h-12 transition-all duration-200 ${isActive
                                    ? 'bg-primary/10 text-primary shadow-sm hover:bg-primary/15'
                                    : 'text-muted-foreground hover:bg-primary/5 hover:text-primary hover:translate-x-1'
                                    }`}
                            >
                                <Link href={item.href} onClick={handleLinkClick}>
                                    <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-primary' : ''}`} />
                                    <span>{item.label}</span>
                                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                                </Link>
                            </Button>
                        );
                    })}
                </div>
            </nav>

            {/* User Profile Section at bottom of sidebar */}
            <div className="p-3 mt-auto border-t border-border/40">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-full justify-start gap-3 h-14 px-3 hover:bg-primary/5">
                            <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                                {initials}
                            </div>
                            <div className="flex-1 text-left overflow-hidden">
                                <p className="text-sm font-medium truncate">{displayName}</p>
                                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                            </div>
                            <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" side="top" className="w-52 mb-1">
                        <DropdownMenuItem asChild>
                            <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                                <User className="h-4 w-4" />
                                Profile & Preferences
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => signOut()}
                            className="text-destructive focus:text-destructive cursor-pointer flex items-center gap-2"
                        >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};

export function AppShell({ children }: { children: React.ReactNode }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[280px_1fr] bg-background">
            {/* Desktop Sidebar */}
            <div className="hidden md:block border-r border-border/40 bg-card shadow-lg z-20 relative">
                <NavContent />
            </div>

            {/* Mobile Header & Main Content */}
            <div className="flex flex-col min-h-screen">
                <header className="flex h-16 items-center gap-4 border-b border-border/40 bg-card/80 backdrop-blur-md px-4 lg:px-6 sticky top-0 z-50 shadow-sm md:hidden">
                    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                            >
                                <PanelLeft className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col p-0 w-72">
                            <VisuallyHidden>
                                <SheetTitle>Navigation Menu</SheetTitle>
                            </VisuallyHidden>
                            <NavContent onLinkClick={() => setIsMobileMenuOpen(false)} />
                        </SheetContent>
                    </Sheet>
                    <div className="flex-1">
                        <Link href="/" className="flex items-center gap-2 font-headline text-lg font-bold">
                            <Logo />
                            <span>SmartDrobe</span>
                        </Link>
                    </div>
                </header>
                <main className="flex-1 flex flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/40">
                    {children}
                </main>
            </div>
            {/* Feedback widget — only shown to authenticated users inside the app shell */}
            <FeedbackWidget />
        </div>
    );
}

