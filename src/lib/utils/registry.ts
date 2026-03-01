import { createProviderRegistry } from "ai";
import { xai } from "@ai-sdk/xai";
import { perplexity } from "@ai-sdk/perplexity";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { LLMSelection } from "../types";

export const registry = createProviderRegistry({
    xai,
    perplexity,
    google,
    openai,
});

export function getModel(llm?: LLMSelection) {
    if (llm) {
        return registry.languageModel(llm);
    }
    
    // Default fallback logic
    if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        return registry.languageModel("google:gemini-1.5-flash");
    }

    if (process.env.OPENAI_API_KEY) {
        return registry.languageModel("openai:gpt-4o");
    }

    if (process.env.XAI_API_KEY) {
        return registry.languageModel("xai:grok-2-1212");
    }
    
    if (process.env.PERPLEXITY_API_KEY) {
        return registry.languageModel("perplexity:sonar");
    }
    
    return registry.languageModel("xai:grok-2-1212");
}

export function isProviderEnabled(providerId: string): boolean {
    switch (providerId) {
        case "xai":
            return !!process.env.XAI_API_KEY;
        case "perplexity":
            return !!process.env.PERPLEXITY_API_KEY;
        case "google":
            return !!process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        case "openai":
            return !!process.env.OPENAI_API_KEY;
        default:
            return false;
    }
}
