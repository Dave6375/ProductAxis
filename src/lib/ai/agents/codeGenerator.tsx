import { createStreamableUI } from "@ai-sdk/rsc";
import { CoreMessage, streamText} from "ai";
import { getModel } from "@/lib/utils/registry";
import { LLMSelection } from "@/lib/types";
import { BotCard } from "../../../app/chat/chat-components";

export interface CodeGeneratorResponse {
    code: string;
    language: 'python' | 'javascript' | 'html' | 'css' | 'sql' | 'markdown';
    hasError: boolean;
}

function renderCodeMessage(content: string) {
    return (
        <BotCard>
             <div className="flex-1 space-y-2 overflow-hidden px-1">
                <pre className="mb-3 overflow-x-auto whitespace-pre-wrap rounded-md border bg-secondary p-3 text-sm leading-relaxed last:mb-0">
                    {content}
                </pre>
            </div>
        </BotCard>
    );
}

export async function codeGenerator(
    uiStream: ReturnType<typeof createStreamableUI>,
    messages: CoreMessage[],
    language: 'python' | 'javascript' | 'html' | 'css' | 'sql' | 'markdown',
    llm: LLMSelection,

): Promise<CodeGeneratorResponse> {
    let fullResponse = "";
    const hasError = false;

    const SYSTEM_PROMPT = `You are an expert automation code generator. Your task is to write clean, production-ready ${language} code that accomplishes the user's automation task.
    
    Requirements:
    1. Write complete, working code
    2. Include necessary imports
    3. Add error handling
    4. Include comments explaining key logic
    5. Use best practices for ${language}
    6. Return ONLY the code, no explanations
    
    Output Format:
    \`\`\`${language}
    [your code here]
    \`\`\`
    
    `;

    uiStream.update(renderCodeMessage(""));

    try {
        const result = await streamText({
            model: getModel(llm),
            messages,
            system: SYSTEM_PROMPT,
            onFinish: (event) => {
                fullResponse = event.text;
            },
        });

        for await (const text of result.textStream) {
            if (text) {
                fullResponse += text;
                uiStream.update(renderCodeMessage(fullResponse));
            }
        }

        uiStream.done(renderCodeMessage(fullResponse));

        return {
            code: fullResponse,
            language,
            hasError,
        };

    } catch (error) {
        const errorMessage = `Error: ${error instanceof Error ? error.message : "An unknown error occurred"}`;
        uiStream.done(renderCodeMessage(errorMessage));
        return {
            code: errorMessage,
            language,
            hasError: true,
        };
    }
}
