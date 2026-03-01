'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

interface State {
    hasError: boolean;
    errorMessage: string;
}

/**
 * ErrorBoundary — catches any uncaught React render errors and shows
 * a friendly recovery UI instead of a blank/broken page.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <YourComponent />
 *   </ErrorBoundary>
 */
export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, errorMessage: '' };
    }

    static getDerivedStateFromError(_error: Error): State {
        return {
            hasError: true,
            // Never expose raw error — show generic message
            errorMessage: 'Something went wrong while loading this section.',
        };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        // Log internally but never show raw error to user
        console.error('[ErrorBoundary]', error.message, info.componentStack);
    }

    handleReset = () => {
        this.setState({ hasError: false, errorMessage: '' });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;

            return (
                <div className="flex flex-col items-center justify-center min-h-[300px] text-center gap-4 p-8 rounded-xl border border-destructive/20 bg-destructive/5">
                    <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
                        <AlertTriangle className="h-7 w-7 text-destructive" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg mb-1">Oops! Something went wrong</h3>
                        <p className="text-muted-foreground text-sm max-w-sm">
                            {this.state.errorMessage}
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={this.handleReset}
                        className="gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Try Again
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}
