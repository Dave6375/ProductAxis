"use client";

import { Spinner } from "@/components/ui/spinner";
import Logo from "@/components/logo";

export function SpinnerMessage() {
    return (
        <div className="group relative flex items-start">
            <div className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm">
                <Logo />
            </div>
            <div className="ml-2 flex h-[24px] flex-1 flex-row items-center space-y-2 overflow-hidden px-1">
                <Spinner />
            </div>
        </div>
    );
}
