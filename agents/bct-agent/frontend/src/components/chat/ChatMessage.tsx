// src/components/features/chat/ChatMessage.tsx
"use client";

import { useState } from "react";
import { ChatMessage as ChatMessageType } from "@/types";
import { Avatar } from "@/components/ui/avatar";
import { BrainCircuit, User, AlertTriangle, ThumbsUp, ThumbsDown, Copy } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { Citation } from "./Citation";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface ChatMessageProps {
  message: ChatMessageType;
  onFeedback?: (messageId: string, feedback: "positive" | "negative") => void;
}

export function ChatMessage({ message, onFeedback }: ChatMessageProps) {
  const [feedbackSent, setFeedbackSent] = useState<"positive" | "negative" | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';
  const isError = message.role === 'error';
  // --- RTL SUPPORT: Get text direction from the context ---
  const { dir } = useLanguage();

  const handleFeedback = (feedback: "positive" | "negative") => {
    if (onFeedback && message.id) {
      onFeedback(message.id, feedback);
      setFeedbackSent(feedback);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const messageVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 15, stiffness: 200 } },
  };

  if (isError) {
    return (
      <motion.div
        variants={messageVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center gap-4 my-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
      >
        <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0" />
        <p className="text-destructive text-sm">{message.content}</p>
      </motion.div>
    );
  }

  return (
    // --- RTL SUPPORT: The `dir` attribute on the parent will flip the order of items.
    // --- `justify-end` and `justify-start` also work correctly with RTL direction.
    <motion.div
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      className={cn("flex items-start gap-4 my-6", isUser ? "justify-end" : "justify-start")}
    >
      {!isUser && (
        <Avatar className="flex-shrink-0 flex items-center justify-center bg-primary/10 text-primary h-10 w-10">
          <BrainCircuit className="w-5 h-5" />
        </Avatar>
      )}

      <div className={cn("flex flex-col gap-2 max-w-2xl", dir === 'rtl' ? "items-end" : "items-start")}>
        {/* --- RTL SUPPORT: Conditional corner rounding based on direction --- */}
        <div className={cn(
            "p-4 rounded-2xl shadow-sm", 
            isUser ? "bg-primary text-primary-foreground" : "bg-muted",
            isUser 
                ? (dir === 'rtl' ? "rounded-bl-none" : "rounded-br-none") 
                : (dir === 'rtl' ? "rounded-br-none" : "rounded-bl-none")
        )}>
          {/* --- RTL SUPPORT: Pass direction to the renderer --- */}
          <MarkdownRenderer content={message.content} dir={dir} />
        </div>

        {isAssistant && (
          <div className="flex items-center gap-2 px-2">
            <button
              onClick={() => handleFeedback("positive")}
              disabled={!!feedbackSent}
              className={cn(
                "p-1 rounded-md transition-colors",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                feedbackSent === "positive" ? "bg-emerald-100 text-emerald-600" : "hover:bg-gray-100"
              )}
            >
              <ThumbsUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleFeedback("negative")}
              disabled={!!feedbackSent}
              className={cn(
                "p-1 rounded-md transition-colors",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                feedbackSent === "negative" ? "bg-red-100 text-red-600" : "hover:bg-gray-100"
              )}
            >
              <ThumbsDown className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopy}
              disabled={isCopied}
              className="p-1 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              <Copy className="w-4 h-4" />
            </button>
            {isCopied && <span className="text-xs text-emerald-600">Copied!</span>}
          </div>
        )}

        {!isUser && message.citations && message.citations.length > 0 && (
           <div className="flex flex-wrap gap-2 px-1">
           {message.citations.map((citation, index) => (
             <Citation key={index} citation={citation} index={index + 1} />
           ))}
         </div>
        )}
      </div>

      {isUser && (
        <Avatar className="flex-shrink-0 flex items-center justify-center bg-muted h-10 w-10">
          <User className="w-5 h-5" />
        </Avatar>
      )}
    </motion.div>
  );
}
