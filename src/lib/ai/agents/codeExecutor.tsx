import {createStreamableUI} from "@ai-sdk/rsc";
import { Sandbox } from "e2b";
import { StreamRenderer } from "../../../app/chat/chat-ui";

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
        uiStream.append(<StreamRenderer d={{
            type: 'execution_status',
            content: `Executing ${language} code...`,
            status: 'in_progress'
        }} />);

        if (!process.env.E2B_API_KEY || process.env.E2B_API_KEY === 'your_e2b_api_key_here') {
            const configMessage = "Error: E2B_API_KEY is not configured or still has the default value. Add it to .env.local to use the sandbox.";
            uiStream.append(<StreamRenderer d={{
                type: 'execution_status',
                content: configMessage,
                status: 'failed'
            }} />);
            return {
                stdout: "",
                stderr: configMessage,
                error: true,
                executionTime: Date.now() - startTime,
            };
        }

        sb = await Sandbox.create();

        let result;
        if (language === 'python') {
            result = await sb.commands.run(`python3 -c ${JSON.stringify(code)}`);
        } else if (language === 'javascript') {
            result = await sb.commands.run(`node -e ${JSON.stringify(code)}`);
        } else {
            // For other languages like HTML/CSS/SQL/Markdown, execution might not mean much in a sandbox without specific tools, 
            // but we can at least return a successful dummy result or just say it's not supported for direct execution.
            uiStream.append(<StreamRenderer d={{
                type: 'execution_status',
                content: `Execution for ${language} is not directly supported in the sandbox.`,
                status: 'unsupported'
            }} />);
            return {
                stdout: "",
                stderr: `Execution for ${language} is not supported.`,
                error: false,
                executionTime: Date.now() - startTime,
            };
        }

        uiStream.append(<StreamRenderer d={{
            type: 'execution_status',
            content: 'Execution completed!',
            status: 'completed'
        }} />);

        return {
            stdout: result.stdout || "",
            stderr: result.stderr || "",
            error: !!result.error || !!result.stderr,
            executionTime: Date.now() - startTime,
        };
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";

        uiStream.append(<StreamRenderer d={{
            type: 'execution_status',
            content: `Execution failed: ${errorMessage}`,
            status: 'failed'
        }} />);
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

