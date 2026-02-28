"use server";

import { createStreamableUI } from "ai/rsc";
import { CoreMessage } from "ai";
import { streamingAgent } from "@/lib/ai/agents/streamingAgent";
import { generateTitle } from "@/lib/ai/agents/title-generator";
import { saveChat } from "@/lib/actions/chat";
import { auth } from "@clerk/nextjs/server";
import { Chat } from "@/lib/types";

export async function submitUserMessage(
    messages: CoreMessage[],
    llm: LLMSelection = "xai:grok-2-1212"
) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }

    const uiStream = createStreamableUI();
    const lastMessage = messages[messages.length - 1];

    // Simple system prompt for now
    const systemPrompt = "You are ProductAxis, a helpful AI assistant.";

    // Start the streaming agent
    const streamPromise = streamingAgent(
        uiStream,
        messages,
        systemPrompt,
        'markdown',
        false,
        llm
    );

    // After the stream finishes, we could save the chat
    streamPromise.then(async (result) => {
        // Generate a title if it's the first message or something
        // For now, let's just assume we want to save it if we have a chat ID
        // This part needs more integration with the frontend's chat state
    });

    return {
        id: Date.now().toString(),
        display: uiStream.value,
    };
}
