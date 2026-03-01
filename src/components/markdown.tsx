"use client";

import { FC, memo } from "react";
import ReactMarkdown, { Options } from "react-markdown";

export const MemoizedReactMarkdown: FC<Options & { className?: string }> = memo(
    ReactMarkdown,
    (prevProps, nextProps) =>
        prevProps.children === nextProps.children &&
        (prevProps as Record<string, unknown>).className === (nextProps as Record<string, unknown>).className,
);