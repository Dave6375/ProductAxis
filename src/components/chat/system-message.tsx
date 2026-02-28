"use client";

export function SystemMessage({ children }: { children: React.ReactNode }) {
    return (
        <div
            className={
                "mt-2 flex items-center justify-center gap-2 text-xs text-gray-500"
            }
        >
            <div className={"max-w-[600px] flex-initial p-2"}>{children}</div>
        </div>
    );
}
