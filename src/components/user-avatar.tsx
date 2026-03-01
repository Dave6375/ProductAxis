"use client";

import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "../lib/utils";
import { useEffect, useState } from "react";
import { UserIcon } from "hugeicons-react";

interface UserAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: string;
}

export default function UserAvatar({ className, ...props }: UserAvatarProps) {
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const { user } = useUser();

    useEffect(() => {
        const timeout = setTimeout(() => setIsMounted(true), 0);
        return () => clearTimeout(timeout);
    }, []);

    if (!isMounted) return null;

    if (!user)
        return (
            <div className="flex h-full w-full items-center justify-center p-0">
                <FallBackUserAvatar />
            </div>
        );

    return (
        <Avatar
            className={cn("h-full w-full rounded-md p-0", className)}
            {...props}
        >
            <AvatarImage src={user.imageUrl} alt={user.id} />
            <AvatarFallback className="flex items-center justify-center rounded-md bg-background">
                <FallBackUserAvatar />
            </AvatarFallback>
        </Avatar>
    );
}

function FallBackUserAvatar() {
    return (
        <div className="flex h-full w-full items-center justify-center rounded-md border bg-secondary p-0">
            <UserIcon className="h-full w-full p-1" />
        </div>
    );
}