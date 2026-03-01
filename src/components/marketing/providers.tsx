"use client";

import * as React from "react";
import {ThemeProvider as NextThemesProvider, useTheme, type ThemeProviderProps} from "next-themes";
import {TooltipProvider} from "@/components/ui/tooltip";
import {SidebarProvider} from "@/components/ui/sidebar";
import {ClerkProvider} from "@clerk/nextjs";
import {AppStateProvider} from "../../lib/hooks/use-app-state";
import {AppSettingsProvider} from "@/lib/hooks/use-app-settings";
import {ExecutionResultProvider} from "@/lib/hooks/use-execution-result"

// This file is a **provider wrapper component**
// This file is a provider wrapper component that sets up the foundational 
//
// context and configuration for Julian's synth-ui project. It acts as a centralized place to wrap the entire application with necessary providers.
export function Providers({children, ...props}: ThemeProviderProps) {
    return (
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
            <NextThemesProvider {...props}>
                <SidebarProvider>
                    <TooltipProvider delayDuration={50}>
                            <AppStateProvider>
                                <AppSettingsProvider>
                                <ExecutionResultProvider>
                                    {children}
                                </ExecutionResultProvider>
                                </AppSettingsProvider>
                            </AppStateProvider>
                    </TooltipProvider>
                </SidebarProvider>
            </NextThemesProvider>
        </ClerkProvider>
    );
}