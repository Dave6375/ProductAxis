"use client";

import { StreamableValue } from "ai/rsc";
import { useStreamableText } from "@/lib/hooks/use-streamable-text";
import { cn } from "@/lib/utils";
import Logo from "@/components/logo";
import { PlainMessage } from "./plain-message";

export function BotMessage({
                               content,
                               className,
                           }: {
    content: string | StreamableValue<string>;
    className?: string;
}) {
    const text = useStreamableText(content);

    return (
        <div className={cn("group relative flex items-start", className)}>
            <div className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm">
                <Logo />
            </div>
            <PlainMessage content={text} />
        </div>
    );
}
