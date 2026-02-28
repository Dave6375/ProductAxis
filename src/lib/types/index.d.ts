import { CoreMessage, ToolContent } from 'ai'

export type LLMSelection = `xai:${string}` | `perplexity:${string}`;

export interface Chat extends Record<string, any> {
    id: string;
    title: string;
    createdAt: Date;
    userId: string;
    path: string;
    messages: CoreMessage[];
    sharePath?: string;
}