"use client";

import UserAvatar from "@/components/user-avatar";

export function UserMessage({ children }: { children: React.ReactNode }) {
    return (
        <div className="group relative flex items-start">
            <div className="flex size-[25px] shrink-0 select-none items-center justify-center rounded-md bg-background p-0 shadow-sm">
                <UserAvatar />
            </div>
            <div className="ml-2 flex-1 space-y-2 overflow-hidden pl-2">
                {children}
            </div>
        </div>
    );
}
