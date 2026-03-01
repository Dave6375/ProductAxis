"use client";

import { readStreamableValue } from "@ai-sdk/rsc";
import type { StreamableValue } from "@ai-sdk/rsc";
import { useEffect, useState } from "react";

export const useStreamableText = (
    content: string | StreamableValue<string>,
) => {
    const [rawContent, setRawContent] = useState<string>(
        typeof content === "string" ? content : "",
    );

    useEffect(() => {
        (async () => {
            if (typeof content === "string") {
                setRawContent(content);
            } else {
                try {
                    let value = "";
                    for await (const delta of readStreamableValue(content)) {
                        if (typeof delta === "string") {
                            setRawContent((value = value + delta));
                        }
                    }
                } catch (error) {
                    console.error("Error in useStreamableText:", error);
                    // Optionally set an error state or message
                    setRawContent((v) => v + "\n\n[Error: Stream interrupted]");
                }
            }
        })();
    }, [content]);

    return rawContent;
};

//streamingAgent asks the model for a response using a streaming API, and as text arrives it updates a “streamable value”.
// Your UI renders that streamable value, so the message appears progressively (chunk by chunk) instead of waiting for the full completion.
