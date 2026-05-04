// src/components/chat/Citation.tsx
"use client";

import { motion, Variants } from "framer-motion";
import { FileText, ExternalLink } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChatMessage } from "@/types";
import { cn } from "@/lib/utils";
import React from "react";
import Image from "next/image"
import { useTheme } from "next-themes";

interface CitationProps {
  citation: NonNullable<ChatMessage['citations']>[number];
  index: number;
}

export function Citation({ citation, index }: CitationProps) {
    const citationVariants: Variants = {
        hidden: { opacity: 0, scale: 0.5 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                damping: 15,
                stiffness: 400,
            }
        },
    };
    const { theme } = useTheme()
    const logoSrc = theme === "light" ? "/BCT white.png" : "/BCT.png"

    // --- INTEGRATION CHANGE: Extract filename from URL for display ---
    const getFilenameFromUrl = (url: string) => {
        try {
            const urlObject = new URL(url);
            const pathParts = urlObject.pathname.split('/');
            return pathParts.pop() || 'Source Document';
        } catch (e) {
            // If it's not a valid URL, return the original string
            return url;
        }
    };

    return (
        <TooltipProvider delayDuration={200}>
            <Tooltip>
                <TooltipTrigger asChild>
                    {/* --- INTEGRATION CHANGE: Wrap component in an anchor tag --- */}
                    <a
                        href={citation.document}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="no-underline"
                    >
                        <motion.div
                            variants={citationVariants}
                            initial="hidden"
                            animate="visible"
                            className="flex items-center gap-2 text-xs px-2 py-1 bg-background border rounded-full cursor-pointer hover:bg-muted transition-colors group"
                        >
                            <FileText className="w-3 h-3 text-primary" />
                            <span>Source {index}</span>
                            <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                    </a>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-center flex flex-col items-center" side="top" align="center">
                    <p className="font-bold mb-1 break-all">{getFilenameFromUrl(citation.document)}</p>
                    <Image
                                  src={logoSrc}
                                  alt="Company Logo"
                                  width={120}
                                  height={120}
                                  priority
                                />
                    {citation.text && <p className="mt-2 italic">{citation.text}</p>}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
