"use client";

import { useState, useRef, useEffect } from "react";
import { useAppState } from "@/lib/hooks/use-app-state";
import { useAppSettings } from "@/lib/hooks/use-app-settings";
import { UserMessage, BotMessage } from "./chat-components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitUserMessage } from "./actions/submit-message";
import { CoreMessage } from "ai";
import { useUser } from "@clerk/nextjs";
import { SidebarTrigger } from "@/components/ui/sidebar";

// Helper to check if a component is a valid React element
function isValidElement(element: unknown): element is React.ReactElement {
    return !!element && typeof element === 'object' && 'type' in element;
}

export default function ChatPage() {
    const { user } = useUser();
    const { isGenerating, setIsGenerating } = useAppState();
    const { settings } = useAppSettings();
    const [messages, setMessages] = useState<{ id: string; display: React.ReactNode }[]>([]);
    const [history, setHistory] = useState<CoreMessage[]>([]);
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const selectedLLM = settings.llm;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isGenerating) return;

        const userMsg = {
            id: Date.now().toString(),
            display: <UserMessage>{inputValue}</UserMessage>,
        };

        setMessages((prev) => [...prev, userMsg]);
        setHistory((prev) => [...prev, { role: "user", content: inputValue }]);
        setInputValue("");
        setIsGenerating(true);

        try {
            const response = await submitUserMessage([...history, { role: "user", content: inputValue }], selectedLLM);
            
            setMessages((prev) => [
                ...prev,
                {
                    id: response.id,
                    display: response.display,
                },
            ]);
            // Note: We'd ideally add the assistant response to history too, but it's a StreamableUI
            // For now, this is better than no history.
        } catch (error) {
            console.error("Failed to submit message:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-background">
            <header className="flex items-center justify-between border-b px-4 h-14">
                <div className="flex items-center gap-2">
                    <SidebarTrigger />
                    <h1 className="text-sm font-semibold">ProductAxis Chat</h1>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                        <h2 className="text-2xl font-bold text-foreground mb-2">
                            Welcome, {user?.firstName || 'there'}!
                        </h2>
                        <p>Start a conversation with ProductAxis AI assistant.</p>
                    </div>
                )}
                {messages.map((m) => {
                    // Safety check: if 'display' looks like a plain object (which shouldn't happen with uiStream.value, but just in case)
                    // we try to render it as a BotMessage if it's missing the React type.
                    // This is a last-resort fallback for RSC hydration issues.
                    if (m.display && typeof m.display === 'object' && !isValidElement(m.display)) {
                        const anyDisplay = m.display as Record<string, unknown>;
                        if (anyDisplay.content !== undefined) {
                            return <div key={m.id}><BotMessage content={anyDisplay.content as string} /></div>;
                        }
                    }
                    return <div key={m.id}>{m.display}</div>;
                })}
                <div ref={messagesEndRef} />
            </main>

            <footer className="p-4 border-t">
                <form onSubmit={handleSubmit} className="flex gap-2 max-w-3xl mx-auto">
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type a message..."
                        disabled={isGenerating}
                        className="flex-1"
                    />
                    <Button type="submit" disabled={isGenerating || !inputValue.trim()}>
                        {isGenerating ? "Thinking..." : "Send"}
                    </Button>
                </form>
            </footer>
        </div>
    );
}
