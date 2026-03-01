"use client";

import { LLMSelection } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ArrowDown01Icon, Forward02Icon, SparklesIcon } from "hugeicons-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";
import { motion } from "framer-motion";
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
    const [open, setOpen] = useState<boolean>(false);
    const selectedLLM = settings.llm;

    return (
        <Select
            defaultValue={
                llms.find((llm) => llm.value === selectedLLM)?.value ?? "openai:gpt-4o"
            }
            onValueChange={(value) => {
                updateSettings({
                    llm: value as LLMSelection,
                });
                toast("Successfully changed LLM", {
                    icon: llms.find((llm) => llm.value === value)?.icon,
                    description: "LLM changed to " + value.split(":")[1],
                });
            }}
            open={open}
            onOpenChange={setOpen}
        >
            <SelectTrigger asChild className="border-none px-0 shadow-none w-full">
                <Button variant="list-item" className="justify-between">
                    <div className="flex items-center gap-3">
                        {llms.find((llm) => llm.value === selectedLLM)?.icon}{" "}
                        {llms.find((llm) => llm.value === selectedLLM)?.name}
                    </div>
                    <motion.div
                        animate={{ rotate: open ? -90 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ArrowDown01Icon className="h-4 w-4 text-muted-foreground" />
                    </motion.div>
                </Button>
            </SelectTrigger>
            <SelectContent className="mx-6 rounded-xl text-xl" side="right">
                {llms.map((llm) => (
                    <SelectItem
                        className="rounded-lg px-2 py-0.5"
                        value={llm.value}
                        key={llm.value}
                    >
                        <div className="flex items-center gap-3 p-1 pr-5">
                            {llm.icon}
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">{llm.name}</span>
                                <span className="text-xs text-muted-foreground">
                  {llm.description}
                </span>
                                <span className="text-xs text-muted-foreground">
                  {llm.suffix}
                </span>
                            </div>
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}