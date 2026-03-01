
'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import './globals.css';
import { AppShell } from '@/components/layout/app-shell';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { ClosetProvider } from '@/hooks/use-closet-store';
import { LanguageProvider } from '@/hooks/use-language';
import { AuthProvider } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';

import { ErrorBoundary } from '@/components/error-boundary';

const AppSkeleton = () => (
  <div className="grid min-h-screen w-full md:grid-cols-[280px_1fr]">
    {/* Desktop Sidebar Skeleton (hidden on mobile) */}
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2 p-2">
        <div className="h-14 w-full animate-pulse bg-muted rounded-md" />
        <div className="flex-1 space-y-1">
          {[...Array(7)].map((_, i) => <div key={i} className="h-10 w-full animate-pulse bg-muted rounded-md" />)}
        </div>
        <div className="mt-auto">
          <div className="h-40 w-full animate-pulse bg-muted rounded-md" />
        </div>
      </div>
    </div>

    {/* Main content skeleton */}
    <div className="flex flex-col">
      {/* Mobile Header Skeleton */}
      <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:hidden">
        <div className="h-8 w-8 animate-pulse bg-muted rounded-md" />
        <div className="h-6 w-32 animate-pulse bg-muted rounded-md" />
      </header>
      {/* Main Content Area Skeleton */}
      <main className="flex-1 p-4 lg:p-6">
        <div className="h-full w-full animate-pulse bg-muted rounded-lg" />
      </main>
    </div>
  </div>
);


function AppContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isLandingPage) {
    return <>{children}</>;
  }

  if (!isMounted) {
    return <AppSkeleton />;
  }

  return (
    <ErrorBoundary>
      <AppShell>{children}</AppShell>
    </ErrorBoundary>
  );
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>SmartDrobe — AI Wardrobe Assistant</title>
        <meta name="description" content="Digitize your wardrobe and get AI-powered outfit recommendations based on weather, occasion, and your personal style." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <LanguageProvider>
              <ClosetProvider>
                <AppContent>{children}</AppContent>
              </ClosetProvider>
            </LanguageProvider>
          </AuthProvider>
          <Toaster />

        </ThemeProvider>
      </body>
    </html>
  );
}
