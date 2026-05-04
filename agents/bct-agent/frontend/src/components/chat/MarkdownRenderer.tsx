// src/components/features/chat/MarkdownRenderer.tsx
"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// --- RTL SUPPORT: Add dir prop ---
interface MarkdownRendererProps {
  content: string;
  dir?: 'ltr' | 'rtl';
}
export function MarkdownRenderer({ content , dir = 'ltr'}: MarkdownRendererProps) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none break-words" dir={dir}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code(props) {
            // Destructure all props, explicitly separating the ones that cause conflicts
            const { children, className, node, style, ref, ...rest } = props;
            const match = /language-(\w+)/.exec(className || "");

            return match ? (
              // Render SyntaxHighlighter for fenced code blocks
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                {...rest}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              // Render a standard `code` tag for inline code
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
