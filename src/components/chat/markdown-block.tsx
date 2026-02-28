"use client";

import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { cn } from "@/lib/utils";
import { CodeBlock } from "@/components/codeblock";
import { MemoizedReactMarkdown } from "@/components/markdown";

export function MarkdownBlock({
                                  content,
                                  raw = false,
                              }: {
    content: string;
    raw?: boolean;
}) {
    return (
        <div className="flex-1 space-y-2">
            <MemoizedReactMarkdown
                className="prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 break-words"
                remarkPlugins={[remarkGfm, remarkMath]}
                components={{
                    ul({ children }) {
                        return (
                            <ul className="my-3 list-outside list-disc pl-6 marker:text-muted-foreground">
                                {children}
                            </ul>
                        );
                    },
                    ol({ children }) {
                        return (
                            <ol className="my-3 list-outside list-decimal pl-3 marker:text-muted-foreground">
                                {children}
                            </ol>
                        );
                    },
                    li({ children }) {
                        return <li className="relative pl-1">{children}</li>;
                    },
                    b({ children, node }) {
                        return <b className="px-1 font-bold">{children}</b>;
                    },
                    p({ children }) {
                        return (
                            <p className="mb-3 text-base leading-loose last:mb-0">
                                {children}
                            </p>
                        );
                    },
                    h1({ children }) {
                        return <h1 className="mb-3 text-2xl font-semibold">{children}</h1>;
                    },
                    h2({ children }) {
                        return <h2 className="mb-3 text-xl font-semibold">{children}</h2>;
                    },
                    h3({ children }) {
                        return <h3 className="mb-3 text-lg font-semibold">{children}</h3>;
                    },
                    h4({ children }) {
                        return <h4 className="mb-3 text-base font-semibold">{children}</h4>;
                    },
                    h5({ children }) {
                        return <h5 className="mb-3 text-sm font-semibold">{children}</h5>;
                    },
                    h6({ children }) {
                        return <h6 className="mb-3 text-xs font-semibold">{children}</h6>;
                    },
                    code(props) {
                        const { node, className, children, ...rest } = props;
                        const match = /language-(\w+)/.exec(className || "");
                        const isInline = !match && !String(children).includes('\n');

                        if (Array.isArray(children) && children.length) {
                            if (children[0] == "▍") {
                                return (
                                    <span className="mt-1 animate-pulse cursor-default">▍</span>
                                );
                            }

                            children[0] = (children[0] as string).replace("`▍`", "▍");
                        }

                        if (isInline) {
                            return (
                                <code
                                    className={cn(
                                        className,
                                        "my-3 rounded-md border bg-secondary px-1 text-sm font-medium text-secondary-foreground shadow-sm",
                                    )}
                                    {...rest}
                                >
                                    {children}
                                </code>
                            );
                        }

                        return (
                            <CodeBlock
                                key={Math.random()}
                                language={(match && match[1]) || ""}
                                value={String(children).replace(/\n$/, "")}
                                raw={raw}
                                {...rest}
                            />
                        );
                    },
                }}
            >
                {content}
            </MemoizedReactMarkdown>
        </div>
    );
}
