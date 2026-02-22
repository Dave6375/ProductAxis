"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ClerkProvider } from "@clerk/nextjs";
import { AppStateProvider } from "@/lib/hooks/use-app-state";
import { AppSettingsProvider } from "@/lib/hooks/use-app-settings";

export function Providers({ children, ...props }: ThemeProviderProps) {
    return (
        <ClerkProvider>
            <NextThemesProvider {...props}>
                    <SidebarProvider>
                        <TooltipProvider delayDuration={50}>
                            <AppStateProvider>
                                <AppSettingsProvider>{children}</AppSettingsProvider>
                            </AppStateProvider>
                        </TooltipProvider>
                    </SidebarProvider>
            </NextThemesProvider>
        </ClerkProvider>
    );
}