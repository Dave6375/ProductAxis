import { experimental_createProviderRegistry as createProviderRegistry } from "ai";
import { xai } from "@ai-sdk/xai";
import { perplexity } from "@ai-sdk/perplexity";
import { LLMSelection } from "../types";

export const registry = createProviderRegistry({
    xai: xai as any,
    perplexity: perplexity as any,
});

export function getModel(llm?: LLMSelection) {
    return registry.languageModel(llm ?? "xai:grok-2-1212");
}

export function isProviderEnabled(providerId: string): boolean {
    switch (providerId) {
        case "xai":
            return !!process.env.XAI_API_KEY;
        case "perplexity":
            return !!process.env.PERPLEXITY_API_KEY;
        default:
            return false;
    }
}