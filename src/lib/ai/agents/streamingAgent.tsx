import { createStreamableUI, createStreamableValue } from "ai/rsc";
import { CoreMessage, streamText } from "ai";
import { getModel } from "@/lib/utils/registry";
import { BotMessage } from "@/components/chat/bot-message";
import { PlainMessage } from "@/components/chat/plain-message";
import { LLMSelection } from "@/lib/types";

export interface StreamResponse {
    response: string;
    hasError: boolean;
}

export async function streamingAgent(
    uiStream: ReturnType<typeof createStreamableUI>,
    messages: CoreMessage[],
    systemPrompt: string,
    codeType: 'python' | 'javascript' | 'html' | 'css' | 'sql' | 'markdown',
    update: boolean = false,
    llm: LLMSelection,
): Promise<StreamResponse> {
    let fullResponse = "";
    const hasError = false;
    const streamableAnswer = createStreamableValue<string>("");

    let textNode: React.ReactNode;

    if (!update) {
        textNode = <PlainMessage content={streamableAnswer.value} indent />;
    } else {
        textNode = <BotMessage content={streamableAnswer.value} />;
    }

    if (update) {
        uiStream.update(textNode);
    } else {
        uiStream.append(textNode);
    }

    try {
        const result = await streamText({
            model: getModel(llm),
            messages,
            system: systemPrompt,
            onFinish: (event) => {
                fullResponse = event.text;
                streamableAnswer.done();
            },
        });

        for await (const text of result.textStream) {
            if (text) {
                fullResponse += text;
                streamableAnswer.update(fullResponse);
            }
        }

        return { response: fullResponse, hasError };
    } catch (err) {
        const errorMessage = `Error: ${err instanceof Error ? err.message : "An unknown error occurred"}`;
        streamableAnswer.update(errorMessage);
        streamableAnswer.done(errorMessage);
        return { response: errorMessage, hasError: true };
    }
}