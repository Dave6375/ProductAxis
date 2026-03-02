import { createStreamableUI } from "@ai-sdk/rsc";
import { CoreMessage, streamText } from "ai";
import { getModel } from "@/lib/utils/registry";
import { LLMSelection } from "@/lib/types";
import { taskAnalyzer } from "@/lib/ai/agents/task-analyzer";
import { codeGenerator } from "@/lib/ai/agents/codeGenerator";
import { codeExecutor } from "@/lib/ai/agents/codeExecutor";
import { stepGenerator } from "@/lib/ai/agents/step-generator";
import { StreamRenderer } from "../../../app/chat/chat-ui";

export interface StreamResponse {
    response: string;
    hasError: boolean;
}

function getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : "An unknown error occurred";
}

function getErrorText(error: unknown): string {
    const message = getErrorMessage(error).toLowerCase();
    let serialized = "";

    try {
        serialized = JSON.stringify(error).toLowerCase();
    } catch {
        serialized = "";
    }

    return `${message} ${serialized}`;
}

function isXaiNoCreditsError(error: unknown): boolean {
    const text = getErrorText(error);
    return text.includes("doesn't have any credits")
        || text.includes("does not have permission to execute the specified operation")
        || text.includes("caller does not have permission");
}

async function streamWithModel(
    llm: LLMSelection,
    messages: CoreMessage[],
    systemPrompt: string,
    onText: (text: string) => void,
): Promise<string> {
    let response = "";

    const result = await streamText({
        model: getModel(llm),
        messages,
        system: systemPrompt,
    });

    for await (const text of result.textStream) {
        if (text) {
            response += text;
            onText(response);
        }
    }

    return response;
}

export async function streamingAgent(
    uiStream: ReturnType<typeof createStreamableUI>,
    messages: CoreMessage[],
    systemPrompt: string,
    codeType: 'python' | 'javascript' | 'html' | 'css' | 'sql' | 'markdown',
    update: boolean = false,
    llm: LLMSelection,
): Promise<StreamResponse> {
    const showAvatar = update;
    const indent = !update;

    console.log("streamingAgent started for LLM:", llm);

    try {
        uiStream.update(<StreamRenderer d={{ content: "", showAvatar, indent }} />);
        if (llm.startsWith("google:") && (!process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY === 'your_gemini_api_key_here')) {
            const configMessage =
                "Error: GOOGLE_GENERATIVE_AI_API_KEY is not configured. Add it to .env.local to use Google Gemini.";
            uiStream.done(<StreamRenderer d={{ content: configMessage, showAvatar, indent }} />);
            return { response: configMessage, hasError: true };
        }

        if (llm.startsWith("perplexity:") && (!process.env.PERPLEXITY_API_KEY || process.env.PERPLEXITY_API_KEY === 'your_perplexity_api_key_here')) {
            const configMessage =
                "Error: PERPLEXITY_API_KEY is not configured. Add it to .env.local to use Perplexity.";
            uiStream.done(<StreamRenderer d={{ content: configMessage, showAvatar, indent }} />);
            return { response: configMessage, hasError: true };
        }

        if (llm.startsWith("openai:") && (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here')) {
            const configMessage =
                "Error: OPENAI_API_KEY is not configured. Add it to .env.local to use ChatGPT.";
            uiStream.done(<StreamRenderer d={{ content: configMessage, showAvatar, indent }} />);
            return { response: configMessage, hasError: true };
        }

        // 1. Analyze task intent
        const analysis = await taskAnalyzer(messages, llm);
        
        if (analysis && (analysis.taskType === 'code_generation' || analysis.taskType === 'code_execution')) {
            const language = analysis.languages || codeType;
            
            // Generate code
            const genResult = await codeGenerator(uiStream, messages, language, llm);
            
            if (genResult.hasError) {
                return { response: genResult.code, hasError: true };
            }

            // If it's code execution, run it
            if (analysis.taskType === 'code_execution') {
                const execResult = await codeExecutor(uiStream, genResult.code, language);
                
                // Also generate steps/explanation
                await stepGenerator(uiStream, genResult.code, llm);
                
                return { response: genResult.code, hasError: execResult.error };
            }

            return { response: genResult.code, hasError: false };
        }

        // Default: stream plain text
        const fullResponse = await streamWithModel(
            llm,
            messages,
            systemPrompt,
            (text) => uiStream.update(<StreamRenderer d={{ content: text, showAvatar, indent }} />),
        );
        uiStream.done(<StreamRenderer d={{ content: fullResponse, showAvatar, indent }} />);
        return { response: fullResponse, hasError: false };
    } catch (error) {
        const hasPerplexityKey = !!process.env.PERPLEXITY_API_KEY;
        const canFallbackToPerplexity =
            llm.startsWith("xai:")
            && hasPerplexityKey
            && isXaiNoCreditsError(error);

        if (canFallbackToPerplexity) {
            const fallbackPrefix = "xAI account has no credits. Switched to Perplexity.\n\n";
            uiStream.update(<StreamRenderer d={{ content: fallbackPrefix, showAvatar, indent }} />);

            try {
                const fallbackResponse = await streamWithModel(
                    "perplexity:sonar",
                    messages,
                    systemPrompt,
                    (text) => uiStream.update(<StreamRenderer d={{
                        content: `${fallbackPrefix}${text}`,
                        showAvatar,
                        indent,
                    }} />),
                );

                const response = `${fallbackPrefix}${fallbackResponse}`;
                uiStream.done(<StreamRenderer d={{ content: response, showAvatar, indent }} />);
                return { response, hasError: false };
            } catch (fallbackError) {
                const fallbackMessage = `Error: ${getErrorMessage(fallbackError)}`;
                uiStream.done(<StreamRenderer d={{ content: fallbackMessage, showAvatar, indent }} />);
                return { response: fallbackMessage, hasError: true };
            }
        }

        if (llm.startsWith("xai:") && isXaiNoCreditsError(error) && !hasPerplexityKey) {
            const message =
                "Error: xAI account has no credits. Add xAI credits or configure PERPLEXITY_API_KEY and switch to Perplexity.";
            uiStream.done(<StreamRenderer d={{ content: message, showAvatar, indent }} />);
            return { response: message, hasError: true };
        }

        const errorMessage = `Error: ${getErrorMessage(error)}`;
        uiStream.done(<StreamRenderer d={{ content: errorMessage, showAvatar, indent }} />);
        return { response: errorMessage, hasError: true };
    }
}
