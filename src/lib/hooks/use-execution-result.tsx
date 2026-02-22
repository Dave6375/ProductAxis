"use client";
// Handles code execution results from E2B Cloud Sandbox
import { createContext, useContext, useCallback, useState } from "react";

interface ExecutionResult {
    code: string;
    output: string;
    error?: string;
    executionTime: number;
    steps: string[]; // Multi-step logic breakdown
}

interface ExecutionResultContext {
    result: ExecutionResult | null;
    isExecuting: boolean;
    setResult: (result: ExecutionResult) => void;
    setIsExecuting: (executing: boolean) => void;
    clearResult: () => void;
}

const ExecutionResultContext = createContext<ExecutionResultContext | undefined>(
    undefined
);

export function useExecutionResult() {
    const context = useContext(ExecutionResultContext);
    if (!context) {
        throw new Error(
            "useExecutionResult must be used within ExecutionResultProvider"
        );
    }
    return context;
}

export function ExecutionResultProvider({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    const [result, setResult] = useState<ExecutionResult | null>(null);
    const [isExecuting, setIsExecuting] = useState(false);

    const clearResult = useCallback(() => {
        setResult(null);
    }, []);

    return (
        <ExecutionResultContext.Provider
            value={{ result, isExecuting, setResult, setIsExecuting, clearResult }}
        >
            {children}
        </ExecutionResultContext.Provider>
    );
}