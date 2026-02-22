import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { CoreMessage } from "ai";
import { Sandbox } from "e2b";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Message transformation
export function transformToolMessages(messages: CoreMessage[]): CoreMessage[] {
    return messages.map((message) =>
        message.role === "tool"
            ? {
                  ...message,
                  role: "assistant",
                  content: JSON.stringify(message.content),
                  type: "tool",
              }
            : message
    ) as CoreMessage[];
}

//Date formatting (for chat history)
export function formatDate(input: string | number | Date): string {
    const date = new Date(input);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export function camelCaseToSpaces(str: string): string {
    return str.replace(/([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g, "$1$4 $2$3$5");
}

/**
 * Parses generated code into logical steps for visualization
 * @param code - The generated code
 * @returns Array of step descriptions
 */

// parseCodeSteps() Break generated code into logical steps for visualization
export function parseCodeSteps(code: string): string[] {
    const steps: string[] = [];
    const lines = code.split("\n").filter((line) => line.trim());

    const imports: string[] = [];
    const functions: string[] = [];

    for (const line of lines) {
        // Extract imports
        if (line.includes("import")) {
            const importMatch = line.match(/from\s+["'](.+?)["']/);
            if (importMatch) {
                imports.push(importMatch[1]);
            }
        }

        // Extract function definitions
        if (line.includes("def") || line.includes("function")) {
            const funcMatch = line.match(/(?:def|function)\s+(\w+)/);
            if (funcMatch) {
                functions.push(funcMatch[1]);
            }
        }
    }

    //Build step descriptions
    if (imports.length > 0) {
        steps.push(`Import dependencies: ${imports.join(", ")}`);
    }
    if (functions.length > 0) {
        steps.push(`Define functions: ${functions.join(", ")}`);
    }

    steps.push("Execute code logic");
    steps.push("Return result");

    return steps;
}

/**
 * Detects the programming language from generated code
 * @param code - The generated code
 * @returns 'python' | 'javascript' | 'html' | 'css' | 'sql' | 'markdown'
 */

export function detectLanguage(
    code: string
): "python" | "javascript" | "html" | "css" | "sql" | "markdown" {
    //python indicators
    if (
        code.includes("import") ||
        code.includes("def") ||
        code.includes("import pandas") ||
        code.includes("import numpy")
    ) {
        return "python";
    }

    //javascript indicators
    if (
        code.includes("const ") ||
        code.includes("import ") ||
        code.includes("import React") ||
        code.includes("function ")
    ) {
        return "javascript";
    }

    // Default to Python if unsure
    return "python";
}

/**
 * Formats execution results for display
 * @param result - Raw execution result
 * @returns Formatted result string
 */

// Format E2B execution results nicely
export function formatExecutionResult(
    result: Awaited<ReturnType<Sandbox["commands"]["run"]>>
): string {
    if (result.stdout) {
        return result.stdout;
    }

    if (result.stderr) {
        return `Error: ${result.stderr}`;
    }

    if (result.error) {
        return `Error: ${result.error}`;
    }

    return "Execution completed with no output";
}

/**
 * Extracts code blocks from AI response
 * @param response - AI response text
 * @returns Code string
 */

//Extract code from AI responses (handles Markdown blocks)
export function extractCode(response: string): string {
    // Look for code blocks with language specification
    const codeBlockMatch = response.match(
        /```(?:python|javascript)?\n([\s\S]*?)```/
    );
    if (codeBlockMatch) {
        return codeBlockMatch[1].trim();
    }

    // Look for plain code blocks
    const plainCodeBlockMatch = response.match(/```([\s\S]*?)```/);
    if (plainCodeBlockMatch) {
        return plainCodeBlockMatch[1].trim();
    }

    // If no code blocks, return the whole response (it might be code)
    return response;
}

/**
 * Validates if a string is valid code
 * @param code - Code string to validate
 * @returns boolean
 */

export function isValidCode(code: string): boolean {
    if (!code || code.trim().length === 0) {
        return false;
    }

    // Basic syntax checks
    const openBraces = (code.match(/{/g) || []).length;
    const closeBraces = (code.match(/}/g) || []).length;
    const openParens = (code.match(/\(/g) || []).length;
    const closeParens = (code.match(/\)/g) || []).length;

    return openBraces === closeBraces && openParens === closeParens;
}

/**
 * Truncates long execution output
 * @param output - Output string
 * @param maxChars - Maximum characters (default: 2000)
 * @returns Truncated output
 */
export function truncateOutput(output: string, maxChars: number = 2000): string {
    if (output.length <= maxChars) {
        return output;
    }

    return output.substring(0, maxChars - 3) + "\n... (output truncated)";
}
