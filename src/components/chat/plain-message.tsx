"use client";

import { StreamableValue } from "ai/rsc";
import { useStreamableText } from "@/lib/hooks/use-streamable-text";
import { cn } from "@/lib/utils";
import { MarkdownBlock } from "./markdown-block";

export function PlainMessage({
                                 content,
                                 indent = false,
                             }: {
    content: string | StreamableValue<string>;
    indent?: boolean;
}) {
    const text = useStreamableText(content);

    return (
        <div
            className={cn(
                "ml-2 flex-1 space-y-2 overflow-hidden px-1",
                indent ? "pl-7" : "",
            )}
        >
            <MarkdownBlock content={text} />
        </div>
    );
}
