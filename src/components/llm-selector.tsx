"use client";

import { LLMSelection } from "@/lib/types";
import { Forward02Icon, SparklesIcon } from "hugeicons-react";
import { toast } from "sonner";
import { useAppSettings } from "@/lib/hooks/use-app-settings";

export const llms: LLMItem[] = [
    {
        icon: <Forward02Icon className="h-6 w-6 text-green-500" />,
        name: "GPT-4o Mini",
        description: "High speed, but low accuracy",
        suffix: "(OpenAI/GPT-4o-mini)",
        value: "openai:gpt-4o-mini",
    },
    {
        icon: <Forward02Icon className="h-6 w-6 text-blue-500" />,
        name: "Gemini 1.5 Flash",
        description: "High quality generation with Google's Flash Model",
        suffix: "(Google/gemini-1.5-flash)",
        value: "google:gemini-1.5-flash",
    },
    {
        icon: <SparklesIcon className="h-6 w-6 text-violet-700" />,
        name: "GPT-4o",
        description: "High quality generation",
        suffix: "(OpenAI/GPT-4o)",
        value: "openai:gpt-4o",
    },
    {
        icon: <SparklesIcon className="h-6 w-6 text-orange-700" />,
        name: "Grok 2",
        description: "Advanced reasoning with xAI's Grok",
        suffix: "(xAI/grok-2-1212)",
        value: "xai:grok-2-1212",
    },
    {
        icon: <SparklesIcon className="h-6 w-6 text-yellow-500" />,
        name: "Perplexity Sonar",
        description: "Search-enhanced AI with Perplexity",
        suffix: "(Perplexity/sonar)",
        value: "perplexity:sonar",
    },
];

interface LLMItem {
    icon: React.ReactNode;
    name: string;
    description: string;
    suffix: string;
    value: LLMSelection;
    highlighted?: boolean;
}

export default function LLMSelector() {
    const { updateSettings, settings } = useAppSettings();
    const selectedLLM = settings.llm;

    return (
        <div className="flex flex-col gap-1 w-full">
            {llms.map((llm) => {
                const isSelected = selectedLLM === llm.value;
                return (
                    <button
                        key={llm.value}
                        onClick={() => {
                            updateSettings({
                                llm: llm.value as LLMSelection,
                            });
                            toast("Successfully changed LLM", {
                                icon: llm.icon,
                                description: "LLM changed to " + llm.name,
                            });
                        }}
                        className={`
                            flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200
                            hover:bg-accent hover:text-accent-foreground
                            ${isSelected ? "bg-accent text-accent-foreground ring-1 ring-ring" : "text-muted-foreground"}
                        `}
                    >
                        <div className="flex-shrink-0">
                            {llm.icon}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className={`text-sm font-medium truncate ${isSelected ? "text-foreground" : ""}`}>
                                {llm.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground truncate leading-tight">
                                {llm.description}
                            </span>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}