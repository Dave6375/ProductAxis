"use server";

import { createStreamableUI } from "@ai-sdk/rsc";
import { CoreMessage } from "ai";
import { streamingAgent } from "@/lib/ai/agents/streamingAgent";
import { generateTitle } from "@/lib/ai/agents/title-generator";
import { saveChat } from "@/lib/actions/chat";
import { auth } from "@clerk/nextjs/server";
import {Chat, LLMSelection} from "@/lib/types";

export async function submitUserMessage(
    messages: CoreMessage[],
    llm: LLMSelection = "xai:grok-2-1212"
) {
    console.log("submitUserMessage called with:", { messageCount: messages.length, llm });
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
        if (!result.hasError) {
            // Placeholder for saving chat history
            // We need a chat ID and title to save correctly
            // For now just ensuring it doesn't crash
        }
    }).catch(err => {
        console.error("Error in streamingAgent promise:", err);
    });

    return {
        id: Date.now().toString(),
        display: uiStream.value,
    };
}
