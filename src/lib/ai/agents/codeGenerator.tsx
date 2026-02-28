import { createStreamableUI, createStreamableValue} from "ai/rsc";
import { CoreMessage, streamText} from "ai";
import {getModel} from "../../utils/registry";
import {LLMSelection} from "../../types";
import {BotMessage} from "@/components/chat";

export interface CodeGeneratorResponse {
    code: string;
    language: 'python' | 'javascript' | 'html' | 'css' | 'sql' | 'markdown';
    hasError: boolean;
}

export async function codeGenerator(
    uiStream: ReturnType<typeof createStreamableUI>,
    messages: CoreMessage[],
    language: 'python' | 'javascript' | 'html' | 'css' | 'sql' | 'markdown',
    llm: LLMSelection,

): Promise<CodeGeneratorResponse> {
    let fullResponse = "";
    const hasError = false;
    const streamableAnswer = createStreamableValue<string>("");

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

    const textNode = <BotMessage content={streamableAnswer.value} />;
    uiStream.append(textNode);

    try {
        const result = await streamText({
            model: getModel(llm),
            messages,
            system: SYSTEM_PROMPT,
            onFinish: (event) => {
                fullResponse = event.text;
                streamableAnswer.done();
            },
        });

        for await (const text of result.textStream) {
            if (text) {
                fullResponse = text;
                streamableAnswer.update(fullResponse);
            }
        }

        return {
            code: fullResponse,
            language,
            hasError,
        };

    } catch (error) {
        const errorMessage = `Error: ${error instanceof Error ? error.message : "An unknown error occurred"}`;
        streamableAnswer.update(errorMessage);
        streamableAnswer.done();
        return {
            code: errorMessage,
            language,
            hasError: true,
        };
    }
}