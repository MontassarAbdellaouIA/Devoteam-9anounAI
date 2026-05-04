// src/components/features/chat/ChatHistory.tsx
import { useEffect, useRef } from 'react';
import { ChatMessage as ChatMessageType } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { BrainCircuit } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { AnimatePresence } from 'framer-motion';

interface ChatHistoryProps {
  messages: ChatMessageType[];
  isLoading: boolean;
}

export function ChatHistory({ messages, isLoading }: ChatHistoryProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto w-full">
      <AnimatePresence>
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
      </AnimatePresence>

      {isLoading && (
         <div className="flex items-start gap-4 my-6">
            <div className="flex-shrink-0 flex items-center justify-center bg-primary/10 text-primary h-10 w-10 rounded-full">
                <BrainCircuit className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-2 mt-2">
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-4 w-48" />
            </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
