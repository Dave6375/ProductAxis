import { CoreMessage, ToolContent } from 'ai'

export type LLMSelection = `xai:${string}` | `perplexity:${string}`;