// src/components/chat/ChatInput.tsx
"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useTheme } from "next-themes"
import { Mic, ArrowUp, Plus, FileText, X } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
// --- RTL SUPPORT: Import the useLanguage hook ---
import { useLanguage } from "@/contexts/LanguageContext"

interface ChatInputProps {
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}

export function ChatInput({ isLoading, onSendMessage }: ChatInputProps) {
  const [inputValue, setInputValue] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme()
  // --- RTL SUPPORT: Get text direction from the context ---
  const { translations, dir } = useLanguage()

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${scrollHeight}px`;
    }
  }, [inputValue]);

  const handleUploadFile = () => {
    fileInputRef.current?.click();
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFiles((prev) => [...prev, file.name]);
    }
  };

  const handleSendMessage = () => {
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
      setInputValue("");
      setUploadedFiles([]);
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
      <div className={cn(
        "w-full bg-card border rounded-xl shadow-sm overflow-hidden mb-4 transition-all duration-300 flex flex-col",
        isFocused && "shadow-[0_0_15px_2px_rgba(19,38,94,0.4)] border-[#13265e]"
      )}>
        <div className="p-4 flex-grow">
          {/* --- RTL SUPPORT: Apply direction and text alignment --- */}
          <textarea
            ref={textareaRef}
            placeholder={translations.chat_placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={isLoading}
            rows={1}
            dir={dir}
            className={cn(
              "w-full bg-transparent text-base outline-none placeholder:text-muted-foreground transition-colors duration-300 disabled:cursor-not-allowed",
              "resize-none overflow-y-auto max-h-48",
              dir === 'rtl' && "text-right placeholder:text-right",
              isFocused
                ? (theme === 'dark' ? 'text-white' : 'text-neutral-900')
                : 'text-foreground'
            )}
          />
        </div>

        {uploadedFiles.length > 0 && (
          <div className="px-4 pb-3">
            <div className="flex flex-wrap gap-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-2 bg-background py-1 px-2 rounded-md border">
                  <FileText className="w-3 h-3 text-primary" />
                  <span className="text-xs text-foreground">{file}</span>
                  <button
                    onClick={() => setUploadedFiles((prev) => prev.filter((_, i) => i !== index))}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- RTL SUPPORT: Reverse the flex direction for controls --- */}
        <div className={cn(
            "px-4 py-3 flex items-center justify-between ",
            dir === 'rtl' && "flex-row-reverse"
        )}>
            <div className="flex items-center border-t">
                <Button
                    onClick={handleUploadFile}
                    variant="ghost"
                    size="icon"
                    className="rounded-full text-muted-foreground hover:bg-muted"
                >
                    <Plus className="w-5 h-5" />
                </Button>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground">
                <Mic className="w-5 h-5" />
                </Button>
                <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    size="icon"
                    className="w-8 h-8 rounded-full"
                >
                <ArrowUp className="w-4 h-4" />
                </Button>
            </div>
        </div>
      </div>
    </div>
  )
}

