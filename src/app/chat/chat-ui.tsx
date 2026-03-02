"use client";

import * as React from "react";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { spinner } from "@/components/spinner";
import { cn } from "@/lib/utils";
import { CodeBlock } from "@/components/codeblock";
import { MemoizedReactMarkdown } from "@/components/markdown";
import UserAvatar from "@/components/user-avatar";
import Logo from "@/components/logo";

// --- Types ---
export interface StreamData {
  content?: string;
  showAvatar?: boolean;
  indent?: boolean;
  type?: 'code' | 'execution_status' | 'analysis_header' | 'analysis_content';
  status?: 'in_progress' | 'completed' | 'failed' | 'unsupported';
}

// --- Components ---

export function MarkdownBlock({
  content,
  raw = false,
}: {
  content: string;
  raw?: boolean;
}) {
  return (
    <div className="flex-1 space-y-2">
      <div className="prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 break-words">
        <MemoizedReactMarkdown
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
            b({ children }) {
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
              const { className, children, ...rest } = props;
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
    </div>
  );
}

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

export function PlainMessage({
  content,
  indent = false,
}: {
  content: string;
  indent?: boolean;
}) {
  return (
    <div
      className={cn(
        "ml-2 flex-1 space-y-2 overflow-hidden px-1",
        indent ? "pl-7" : "",
      )}
    >
      <MarkdownBlock content={content} />
    </div>
  );
}

export function BotMessage({
  content,
  className,
  showAvatar = true,
  indent = false,
}: {
  content: string;
  className?: string;
  showAvatar?: boolean;
  indent?: boolean;
}) {
  return (
    <div className={cn("group relative flex items-start", className)}>
      <div className={cn(
        "flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm",
        !showAvatar && "invisible"
      )}>
        <Logo />
      </div>
      <PlainMessage content={content} indent={indent} />
    </div>
  );
}

export function BotCard({
  children,
  showAvatar = true,
}: {
  children: React.ReactNode;
  showAvatar?: boolean;
}) {
  return (
    <div className="group relative flex items-start">
      <div
        className={cn(
          "flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm",
          !showAvatar && "invisible",
        )}
      >
        <Logo />
      </div>
      <div className="ml-2 flex-1 pl-2">{children}</div>
    </div>
  );
}

export function StreamRenderer({ d }: { d: StreamData }) {
  if (d && typeof d === 'object') {
    if (d.content !== undefined && d.type === undefined) {
      return (
        <BotMessage
          content={d.content}
          showAvatar={d.showAvatar}
          indent={d.indent}
        />
      );
    }

    switch (d.type) {
      case "code":
        return (
          <BotCard>
            <div className="flex-1 space-y-2 overflow-hidden px-1">
              <pre className="mb-3 overflow-x-auto whitespace-pre-wrap rounded-md border bg-secondary p-3 text-sm leading-relaxed last:mb-0">
                {d.content}
              </pre>
            </div>
          </BotCard>
        );
      case "execution_status": {
        let colorClass = "text-blue-500";
        if (d.status === "completed") colorClass = "text-green-500";
        if (d.status === "failed") colorClass = "text-red-500";
        if (d.status === "unsupported") colorClass = "text-yellow-500";

        return (
          <BotCard showAvatar={false}>
            <div className={`text-sm ${colorClass}`}>{d.content}</div>
          </BotCard>
        );
      }
      case "analysis_header":
        return (
          <BotCard showAvatar={false}>
            <div className="text-sm font-semibold mb-2">{d.content}</div>
          </BotCard>
        );
      case "analysis_content":
        return (
          <BotCard showAvatar={false}>
            <div className="text-sm font-semibold mb-2">Analysis:</div>
            <div className="text-sm whitespace-pre-wrap">{d.content}</div>
          </BotCard>
        );
    }
  }

  return null;
}

export function SpinnerMessage() {
  return (
    <div className="group relative flex items-start">
      <div className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm">
        <Logo />
      </div>
      <div className="ml-2 flex h-[24px] flex-1 flex-row items-center space-y-2 overflow-hidden px-1">
        {spinner}
      </div>
    </div>
  );
}
