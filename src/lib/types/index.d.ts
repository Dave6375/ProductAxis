import { CoreMessage, ToolContent } from 'ai'

export type LLMSelection = `xai:${string}` | `perplexity:${string}` | `google:${string}` | `openai:${string}`;

export interface Chat {
    id: string;
    title: string;
    createdAt: Date;
    userId: string;
    path: string;
    messages: CoreMessage[];
    sharePath?: string;
}