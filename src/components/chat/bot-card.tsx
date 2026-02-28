"use client";

import { cn } from "@/lib/utils";
import Logo from "@/components/logo";

export function BotCard({
                            children,
                            showAvatar = true,
                        }: {
    children: React.ReactNode;
    showAvatar?: boolean;
}) {
    return (
        <div className="group relative flex items-start">
            <div
                className={cn(
                    "flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm",
                    !showAvatar && "invisible",
                )}
            >
                <Logo />
            </div>
            <div className="ml-2 flex-1 pl-2">{children}</div>
        </div>
    );
}
