import {createStreamableUI} from "@ai-sdk/rsc";
import { Sandbox } from "e2b";
import { BotCard } from "../../../app/chat/chat-components";

export interface ExecutionResponse {
    stdout: string;
    stderr: string;
    error: boolean;
    executionTime: number;
}

export async function codeExecutor(
    uiStream: ReturnType<typeof createStreamableUI>,
    code: string,
    language: 'python' | 'javascript' | 'html' | 'css' | 'sql' | 'markdown',
): Promise<ExecutionResponse> {
    const startTime = Date.now();
    let sb: Sandbox | undefined;
    try {
        uiStream.append(
            <BotCard showAvatar={false}>
                <div className='text-sm text-blue-500'>Executing {language} code...</div>
            </BotCard>
        );

        sb = await Sandbox.create();

        let result;
        if (language === 'python') {
            result = await sb.commands.run(`python3 -c ${JSON.stringify(code)}`);
        } else if (language === 'javascript') {
            result = await sb.commands.run(`node -e ${JSON.stringify(code)}`);
        } else {
            // For other languages like HTML/CSS/SQL/Markdown, execution might not mean much in a sandbox without specific tools, 
            // but we can at least return a successful dummy result or just say it's not supported for direct execution.
            uiStream.append(
                <BotCard showAvatar={false}>
                    <div className='text-sm text-yellow-500'>Execution for {language} is not directly supported in the sandbox.</div>
                </BotCard>
            );
            return {
                stdout: "",
                stderr: `Execution for ${language} is not supported.`,
                error: false,
                executionTime: Date.now() - startTime,
            };
        }

        uiStream.append(
            <BotCard showAvatar={false}>
                <div className='text-sm text-green-500'>Execution completed!</div>
            </BotCard>
        );

        return {
            stdout: result.stdout || "",
            stderr: result.stderr || "",
            error: !!result.error || !!result.stderr,
            executionTime: Date.now() - startTime,
        };
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";

        uiStream.append(
            <BotCard showAvatar={false}>
                <div className='text-sm text-red-500'>Execution failed: {errorMessage}</div>
            </BotCard>
        );
        return {
            stdout: "",
            stderr: errorMessage,
            error: true,
            executionTime: Date.now() - startTime,
        };
    } finally {
        if (sb) {
            await sb.kill();
        }
    }
}

