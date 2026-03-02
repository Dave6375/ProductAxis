import { createStreamableUI } from "@ai-sdk/rsc";
import { CoreMessage, streamText} from "ai";
import { getModel } from "@/lib/utils/registry";
import { LLMSelection } from "@/lib/types";
import { StreamRenderer } from "../../../app/chat/chat-ui";

export interface CodeGeneratorResponse {
    code: string;
    language: 'python' | 'javascript' | 'html' | 'css' | 'sql' | 'markdown';
    hasError: boolean;
}

function renderCodeMessage(content: string) {
    return {
        type: 'code',
        content
    };
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

    uiStream.update(<StreamRenderer d={renderCodeMessage("")} />);

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
                uiStream.update(<StreamRenderer d={renderCodeMessage(fullResponse)} />);
            }
        }

        uiStream.done(<StreamRenderer d={renderCodeMessage(fullResponse)} />);

        return {
            code: fullResponse,
            language,
            hasError,
        };

    } catch (error) {
        const errorMessage = `Error: ${error instanceof Error ? error.message : "An unknown error occurred"}`;
        uiStream.done(<StreamRenderer d={renderCodeMessage(errorMessage)} />);
        return {
            code: errorMessage,
            language,
            hasError: true,
        };
    }
}
