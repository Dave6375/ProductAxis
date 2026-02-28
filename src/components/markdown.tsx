import { FC, memo } from "react";
import ReactMarkdown, { Options } from "react-markdown";

export const MemoizedReactMarkdown: FC<Options & { className?: string }> = memo(
    ReactMarkdown,
    (prevProps, nextProps) =>
        prevProps.children === nextProps.children &&
        (prevProps as any).className === (nextProps as any).className,
);